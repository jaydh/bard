import { youtubeAPI } from "../../src/apiKeys";
import { play } from "./queueActions";
import { parse, toSeconds } from "iso8601-duration";

// tslint:disable:variable-name

export const addYoutubeSong = t => {
  return async (dispatch, getState) => {
    const database = window.firebase.firestore();
    const name = t.snippet.title;
    const id = t.id.videoId;
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${youtubeAPI}&id=${id}&part=snippet,contentDetails`
    );
    const json = await res.json();
    const duration_ms = json.items[0]
      ? toSeconds(parse(json.items[0].contentDetails.duration)) * 1000
      : undefined;

    const ref = database
      .collection("userData")
      .doc(getState().userReducer.user.uid)
      .collection("youtubeTracks")
      .doc(id);

    const track = {
      name,
      id,
      added_at: new Date().getTime(),
      duration_ms
    };
    await ref.set(track);

    dispatch({
      type: "ADD_YOUTUBE_TRACK",
      track
    });
  };
};

export const fetchYoutubeSongs = () => {
  return async (dispatch, getState) => {
    const database = window.firebase.firestore();
    const user = getState().userReducer.user;
    if (user) {
      const ref = database
        .collection("userData")
        .doc(user.uid)
        .collection("youtubeTracks");
      const songs = await ref.get().then(querySnapshot => {
        const data = [];
        querySnapshot.forEach(async doc => {
          const { id, name, added_at } = doc.data();
          let { duration_ms } = doc.data();
          if (!duration_ms) {
            const res = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?key=${youtubeAPI}&id=${id}&part=snippet,contentDetails`
            );
            const json = await res.json();
            duration_ms = json.items[0]
              ? toSeconds(parse(json.items[0].contentDetails.duration)) * 1000
              : null;

            await ref.doc(id).set(
              {
                duration_ms
              },
              {
                merge: true
              }
            );
          }

          data.push({
            youtube: true,
            added_at,
            track: {
              id,
              name,
              duration_ms
            }
          });
        });
        return data;
      });
      return dispatch({
        type: "FETCH_YOUTUBE_TRACKS_SUCCESS",
        songs
      });
    }
  };
};

export const fetchSongsPending = () => {
  return {
    type: "FETCH_SONGS_PENDING"
  };
};

export const fetchSongsSuccess = songs => {
  return {
    songs,
    type: "FETCH_SONGS_SUCCESS"
  };
};

export const fetchSongsError = () => {
  return {
    type: "FETCH_SONGS_ERROR"
  };
};

export const fetchSongs = () => {
  return async (dispatch, getState) => {
    dispatch(fetchSongsPending());
    const accessToken = getState().token.token;
    let next = `https://api.spotify.com/v1/me/tracks?limit=50`;
    let tracks = [];
    const currentFirst = getState().songsReducer.spotifyTracks[0];
    while (next) {
      const request = new Request(next, {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      });
      const json = await (await fetch(request)).json();
      if (json.error) {
        dispatch(fetchSongsError());
      }
      if (
        !json.items ||
        (currentFirst && json.items[0].track.id === currentFirst.track.id)
      ) {
        break;
      }
      next = json.next;
      tracks = tracks.concat(
        json.items.map(t => {
          return {
            added_at: t.added_at,
            spotify: true,
            track: t.track
          };
        })
      );
    }
    dispatch(fetchSongsSuccess(tracks));
    return Promise.resolve();
  };
};
export const fetchRecentlyPlayedPending = () => {
  return {
    type: "FETCH_RECENTLY_PLAYED_PENDING"
  };
};

export const fetchRecentlyPlayedSuccess = songs => {
  return {
    songs,
    type: "FETCH_RECENTLY_PLAYED_SUCCESS"
  };
};

export const fetchRecentlyPlayedError = () => {
  return {
    type: "FETCH_RECENTLY_PLAYED_ERROR"
  };
};

export const fetchRecentlyPlayed = () => {
  return (dispatch, getState) => {
    const accessToken = getState().token.token;
    const request = new Request(
      `https://api.spotify.com/v1/me/player/recently-played`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken
        })
      }
    );

    dispatch(fetchRecentlyPlayedPending());

    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(res => {
        dispatch(fetchRecentlyPlayedSuccess(res.items));
      });
  };
};

export const updateViewType = view => {
  return {
    type: "UPDATE_VIEW_TYPE",
    view
  };
};

export const seek = time => {
  return async (dispatch, getState) => {
    dispatch({
      type: "SEEK"
    });
    const position = getState().queue.position;
    const track = getState().queue.queue[position].track;

    if (!track) {
      window.ytPlayer.pauseVideo();
      const state = await window.player.getCurrentState();
      state ? window.player.togglePlay() : dispatch(play());
    } else if (!track.uri) {
      window.ytPlayer.seekTo(time / 1000, true);
    } else {
      window.player.seek(time);
    }
  };
};

export const addSpotifySong = track => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    await fetch(`https://api.spotify.com/v1/me/tracks`, {
      method: "PUT",
      body: JSON.stringify({
        ids: [track.id]
      }),
      headers: new Headers({
        Authorization: "Bearer " + accessToken
      })
    });
    dispatch({ type: "ADD_SONG_TO_LIBRARY", track, spotify: true });
  };
};

export const removeSpotifySong = track => {
  return async (dispatch, getState) => {
    const accessToken = getState().token.token;
    await fetch(`https://api.spotify.com/v1/me/tracks`, {
      method: "DELETE",
      body: JSON.stringify({
        ids: [track.id]
      }),
      headers: new Headers({
        Authorization: "Bearer " + accessToken
      })
    });
    dispatch({ type: "REMOVE_SONG_FROM_LIBRARY", id: track.id });
  };
};

export const removeYoutubeSong = track => {
  return async (dispatch, getState) => {
    const database = window.firebase.firestore();
    const id = track.id;
    const ref = database
      .collection("userData")
      .doc(getState().userReducer.user.uid)
      .collection("youtubeTracks")
      .doc(id);
    await ref.delete();
    dispatch({
      type: "REMOVE_YOUTUBE_TRACK",
      id
    });
  };
};
