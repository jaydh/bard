import { store } from "../index";
import { nextSong } from "../actions/queueActions";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: any;
    ytPlayer: any;
    YT: any;
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
    player: any;
  }
}

declare var YT: any;
declare var Spotify: any;

export const initYoutube = () => {
  const { youtubeReady } = store.getState().player;
  if (!youtubeReady) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    tag.defer = true;

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag!.parentNode!.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = () => {
      window.ytPlayer = new YT.Player("ytPlayer", {
        height: "500",
        width: `${
          window.matchMedia("(max-width: 400px)").matches
        }?'70vw':'25vw'`,
        suggestedQuality: "small",
        playerVars: {
          controls: 0,
          disablekd: 1,
          modestbranding: 1,
          fs: 1
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    };

    // 4. The API will call this function when the video player is ready.
    const onPlayerReady = (event: any) => {
      const { player } = store.getState();
      window.ytPlayer.setVolume(player.muted ? 0 : player.volume);
      store.dispatch({ type: "YOUTUBE_READY" });
    };

    const onPlayerStateChange = (event: any) => {};
  }
};

export const initSpotify = () => {
  const { spotifyReady } = store.getState().player;
  if (!spotifyReady) {
    const tag = document.createElement("script");
    tag.src = "https://sdk.scdn.co/spotify-player.js";
    tag.async = true;
    tag.defer = true;

    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag!.parentNode!.insertBefore(tag, firstScriptTag);

    window.onSpotifyWebPlaybackSDKReady = () => {
      window.player = new Spotify.Player({
        name: "bard",
        getOAuthToken: (cb: any) => {
          const token = store.getState().token.token;
          cb(token);
        }
      });

      // Error handling
      window.player.addListener("initialization_error", ({ message }: any) => {
        console.error(message);
      });
      window.player.addListener("authentication_error", ({ message }: any) => {
        console.error(message);
      });
      window.player.addListener("account_error", ({ message }: any) => {
        console.error(message);
      });
      window.player.addListener("playback_error", ({ message }: any) => {
        console.error(message);
      });

      // Playback status updates
      window.player.addListener("player_state_changed", (state: any) => {});

      // Ready
      window.player.addListener("ready", ({ device_id }: any) => {
        const { player } = store.getState();
        window.player.setVolume(player.muted ? 0 : player.volume / 100);
        store.dispatch({ type: "SPOTIFY_READY" });
      });

      // Not Ready
      window.player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      // Connect to the player!
      window.player.connect();
    };
  }
};
