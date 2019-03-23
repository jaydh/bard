import { SnackbarProvider } from "notistack";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import "./App.css";
import MainView from "./containers/MainView";

interface IProps {
  onReset: () => void;
  initSpotify: () => void;
  initYoutube: () => void;
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    props.initYoutube();
    props.initSpotify();
  }

  public render() {
    return (
      <SnackbarProvider maxSnack={5}>
        <div id="app-container">
          <MainView />
        </div>
      </SnackbarProvider>
    );
  }
  public componentDidCatch(error: any, info: any) {
    this.props.onReset();
  }
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onReset: () => dispatch({ type: "RESET" }),
      initSpotify: () => dispatch({ type: "INIT_SPOTIFY_REQUESTED" }),
      initYoutube: () => dispatch({ type: "INIT_YOUTUBE_REQUESTED" })
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(App);
