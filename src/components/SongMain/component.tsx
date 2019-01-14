import * as React from "react";
import loader from "../../helpers/loader";
import MainBar from "../MainBar";
const SongList = loader(() => import("../SongList"));

interface IProps {
  fetchSongs: () => void;
  fetchYoutubeSongs: () => void;
  fetchPlaylistSongs: (owner: string, id: string) => void;
  fetchUnifiedSongs: (ownder: string, id: string) => void;
  fetchNew: () => void;
  fetchRecent: () => void;
  location: any;
  match: any;
  firebaseLoaded: boolean;
}

interface IState {
  playlistId?: string;
  isUnified?: boolean;
}

class SongMain extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = { playlistId: undefined, isUnified: undefined };
    this.handleFetch = this.handleFetch.bind(this);
  }

  public componentDidMount() {
    if (this.props.firebaseLoaded) {
      console.log("dd");
      this.handleFetch(this.props);
    }
  }
  public componentDidUpdate(oldProps: IProps) {
    console.log("dass", this.props);
    if (this.props.firebaseLoaded) {
      console.log("dd");
      //    this.handleFetch(this.props, oldProps);
    }
  }

  public render() {
    return (
      <main id="page-wrap" className="main-view">
        <MainBar />
        <SongList isLibrary={this.props.location.pathname === "/library"} />
      </main>
    );
  }
  private handleFetch(current: IProps, prev?: IProps) {
    const {
      location,
      match,
      fetchPlaylistSongs,
      fetchUnifiedSongs,
      fetchSongs,
      fetchYoutubeSongs,
      fetchRecent,
      fetchNew
    } = current;
    if (!prev || prev.location.pathname !== location.pathname) {
      if (location.pathname === "/library") {
        fetchSongs();
        fetchYoutubeSongs();
      } else if (match.params.type === "spotify") {
        fetchPlaylistSongs(match.params.owner, match.params.id);
        this.setState({ playlistId: match.params.id });
        this.setState({ isUnified: false });
      } else if (match.params.type === "unified") {
        this.setState({ isUnified: true });
        fetchUnifiedSongs(match.params.owner, match.params.id);
      } else if (location.pathname === "/recent") {
        fetchRecent();
      } else if (location.pathname === "/new") {
        fetchNew();
      }
    }
  }
}

export default SongMain;
