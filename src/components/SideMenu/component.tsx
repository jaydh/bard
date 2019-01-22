import {
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Tab,
  Tabs,
  withStyles
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import * as React from "react";
import AddYoutube from "../AddYoutube";
import UserDetails from "../UserDetails";
import UserPlaylists from "../UserPlaylists";

interface IProps {
  classes: any;
  open: boolean;
  onSideClose: () => void;
  location: any;
  history: any;
}

interface IState {
  tabValue: string;
}

class SideMenu extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      tabValue: props.location.pathname.substring(1)
    };
    this.handleHistoryPush = this.handleHistoryPush.bind(this);
  }
  public render() {
    const { classes, open, onSideClose, location } = this.props;
    const { tabValue } = this.state;
    const path = location.pathname.substring(1);
    const useTab =
      path === "library" || path === "new" || path === "recent" ? true : false;
    return (
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Grid container className={classes.drawerHeader}>
          <Grid item xs={10} sm={10} md={10} lg={10}>
            <UserDetails />
          </Grid>
          <Grid item>
            <IconButton onClick={onSideClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <AddYoutube />

        <Tabs
          value={useTab ? tabValue : false}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            value="library"
            label="Library"
            onClick={this.handleHistoryPush("/library")}
          />
          <Tab
            value="recent"
            label="Recently Played"
            onClick={this.handleHistoryPush("/recent")}
          />
          <Tab
            value="new"
            label="New Ablums"
            onClick={this.handleHistoryPush("/new")}
          />
        </Tabs>

        <Divider />
        <UserPlaylists />
      </Drawer>
    );
  }

  private handleHistoryPush = (value: string) => () => {
    this.props.history.push(value);
    this.setState({ tabValue: value.substring(1) });
  };
}

const drawerWidth = Math.min(500, window.innerWidth);

const styles = (theme: any) => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});

export default withStyles(styles)(SideMenu);
