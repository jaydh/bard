import {
  AppBar,
  Button,
  Collapse,
  Fade,
  Grid,
  IconButton,
  Toolbar,
  withStyles
} from '@material-ui/core';
import Clear from '@material-ui/icons/DeleteSweep';
import MenuIcon from '@material-ui/icons/Menu';
import Add from '@material-ui/icons/PlaylistAdd';
import AddCheck from '@material-ui/icons/PlaylistAddCheck';
import QueueIcon from '@material-ui/icons/QueueMusic';
import * as React from 'react';

import './SongListOptions.css';

import CurrentArt from '../CurrentArt';
import Filter from '../Filter';
import Queue from '../Queue';
import SideMenu from '../SideMenu';
import SongControls from '../SongControls';
import SongProgress from '../SongProgress';
import Sort from '../Sort';
import Volume from '../VolumeControls';

interface IProps {
  pending: boolean;
  isLibrary: boolean;
  playlistId: string;
  isUnified: boolean;
  update: () => void;
  convertPlaylistToUnified: (name: string) => void;
  selectionMade: boolean;
  addSelected: () => void;
  makeQueueFromSelection: () => void;
  clearSelection: () => void;
  classes: any;
  currentTrack: any;
  selection: boolean;
}

interface IState {
  sideMenuOpen: boolean;
  queueOpen: boolean;
}

const drawerWidth = 600;

class SongListOptions extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = { sideMenuOpen: false, queueOpen: false };
    this.handleSideOpen = this.handleSideOpen.bind(this);
    this.handleSideClose = this.handleSideClose.bind(this);
    this.handleQueueOpen = this.handleQueueOpen.bind(this);
    this.handleQueueClose = this.handleQueueClose.bind(this);
    this.convert = this.convert.bind(this);
  }
  public render() {
    const {
      classes,
      currentTrack,
      playlistId,
      isLibrary,
      isUnified,
      selection,
      makeQueueFromSelection,
      addSelected,
      clearSelection
    } = this.props;
    return (
      <>
        <AppBar position="relative" className={classes.appBar}>
          <Toolbar disableGutters={!open}>
            <Grid
              container={true}
              spacing={40}
              alignItems="center"
              justify="space-between"
            >
              <Grid item={true} container={true} xs={4} sm={4} md={4} lg={4}>
                <Grid item={true}>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleSideOpen}
                    className={classes.menuButton}
                    children={<MenuIcon />}
                  />
                </Grid>
              </Grid>
              <Fade in={currentTrack}>
                <Grid
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  item={true}
                  container={true}
                  alignItems="center"
                  justify="center"
                >
                  <SongControls />
                  <SongProgress />
                </Grid>
              </Fade>
              <Grid
                item={true}
                container={true}
                justify="flex-end"
                alignItems="center"
                xs={4}
                sm={4}
                md={4}
                lg={4}
              >
                <Fade in={selection}>
                  <Grid item={true}>
                    <Button onClick={clearSelection}>
                      <Clear />
                    </Button>
                    <Button onClick={addSelected}>
                      <Add />
                    </Button>
                    <Button onClick={makeQueueFromSelection}>
                      <AddCheck />
                    </Button>
                  </Grid>
                </Fade>
                <Grid item={true} children={<Filter />} />
                <Grid item={true} children={<Sort />} />
                <Grid item={true} children={<Volume />} />
                <Grid
                  item={true}
                  children={
                    <IconButton
                      color="inherit"
                      aria-label="Open drawer"
                      onClick={this.handleQueueOpen}
                      className={classes.menuButton}
                      children={<QueueIcon />}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Toolbar>
          <Collapse in={currentTrack}>
            <CurrentArt />
          </Collapse>
        </AppBar>
        {playlistId && !isLibrary && !isUnified && (
          <button className="btn" onClick={this.convert(this.props.playlistId)}>
            Convert to unified
          </button>
        )}
        <SideMenu
          open={this.state.sideMenuOpen}
          handleClose={this.handleSideClose}
        />
        <Queue
          open={this.state.queueOpen}
          handleClose={this.handleQueueClose}
        />
      </>
    );
  }
  private convert = name => () => {
    this.props.convertPlaylistToUnified(name);
  };

  private handleSideOpen() {
    this.setState({ sideMenuOpen: true, queueOpen: false });
  }
  private handleSideClose() {
    this.setState({ sideMenuOpen: false });
  }
  private handleQueueOpen() {
    this.setState({ queueOpen: true, sideMenuOpen: false });
  }
  private handleQueueClose() {
    this.setState({ queueOpen: false });
  }
}

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    backgroundColor: '#82b1ff',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});

export default withStyles(styles)(SongListOptions);
