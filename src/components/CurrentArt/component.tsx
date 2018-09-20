import * as React from "react";
import SongControls from "../SongControls";
import "./SongControls.css";

interface IProps {
  currentTrack: any;
}

interface IState {
  showYT: boolean;
}
class CurrentArt extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showYT: false
    };
    this.toggleYoutube = this.toggleYoutube.bind(this);
  }
  public componentWillReceiveProps(nextProps) {
    if (nextProps.currentTrack && !nextProps.currentTrack.youtube) {
      this.setState({ showYT: false });
      document.getElementById("ytPlayer")!.style.display = "none";
    }
  }
  public render() {
    let image = "";
    if (this.props.currentTrack) {
      image = this.props.currentTrack.track.album
        ? this.props.currentTrack.track.album.images[1].url
        : `http://img.youtube.com/vi/${
            this.props.currentTrack.track.id
          }/hqdefault.jpg`;
    }
    return (
      <div
        style={{
          backgroundImage: this.state.showYT ? "" : `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: `${
            window.matchMedia("(min-width: 400px)").matches
          }?'30vw':'80vw'`,
          height: "20vh"
        }}
      >
        {this.props.currentTrack &&
          this.props.currentTrack.youtube && (
            <button className="btn">
              <i className="fab fa-youtube" onClick={this.toggleYoutube} />
            </button>
          )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ alignSelf: "flex-end", maxWidth: "50%" }}>
            <SongControls />
          </div>
          <div
            id="ytPlayer"
            style={{
              display: "none",
              padding: "20px",
              margin: "auto",
              maxHeight: "75%",
              height: "auto"
            }}
          />
        </div>
      </div>
    );
  }
  private toggleYoutube() {
    document.getElementById("ytPlayer")!.style.display = this.state.showYT
      ? "none"
      : "flex";
    this.setState({ showYT: !this.state.showYT });
  }
}
export default CurrentArt;
