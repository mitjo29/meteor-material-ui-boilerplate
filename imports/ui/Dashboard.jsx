import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import UsersIcon from '@material-ui/icons/People';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { Copyright } from './components/copyright';
import AuthMenu from './components/auth';
import {Images} from '/imports/api/images/images';
import {
  Outlet
} from "react-router-dom";
import DashboardContent from './components/dashboardContent';
import Users from './Users'
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  avatar_mini: {
    width: 32,
    height: 32
  }
}));

export default function Dashboard() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const {user, avatar, isLoading }  = useTracker(() =>  {
      let isLoading = true;
      const noDataAvailable = { users: [], avatar: [], isLoading };
      if (!Meteor.user()) {
        return noDataAvailable;
      }
      const handler = Meteor.subscribe('users.current');
      
      if (!handler.ready()) {
        return { ...noDataAvailable, isLoading: true };
      }
  
      const subscription = Meteor.subscribe('images.avatar')
      if (!subscription.ready()) {
        return { ...noDataAvailable, isLoading: true };
      }
      
      const user = Meteor.users.findOne(
        {_id: Meteor.userId()
        }
      );
      const avatar = Images.findOne({'meta.objectId': Meteor.userId()});
      return { user, avatar, isLoading };
      
    });
    const avatarlink = avatar ? Meteor.absoluteUrl() + avatar._downloadRoute + "/" + avatar._collectionName + "/" + avatar._id + "/original/" + avatar._id + "." + avatar.extension : undefined;

    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
      setOpen(false);
    };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <AuthMenu />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            p={2}
          >
            <Avatar
              className={clsx(classes.avatar, !open && classes.avatar_mini)}
              component={RouterLink}
              src={avatarlink ? avatarlink : "/images/avatar_male.png"}
              to="/profile"
            />
            {open && <Box><Typography
              className={classes.name}
              color="textPrimary"
              variant="h5"
            >
              {user && user.firstName ? user.firstName : ""} {user && user.lastName ? user.lastName : ""}
            </Typography>
            <Typography
              color="textSecondary"
                variant="body2"
              > 
            {user && user.emails[0] ? user.emails[0].address : ""}
          </Typography></Box>}
        </Box>
          <Divider />
          <List>
            <ListItem button component={RouterLink} to="/">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={RouterLink} to="/users">
              <ListItemIcon>
                <UsersIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
          </List>
          <Divider />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
          <Router>
            <Switch >
              <Route path="/" exact component={DashboardContent} />
              <Route path="/users" exact component={DashboardContent} />
            </Switch>
          </Router>
          </Container>
        </main>
      </div>
    );
  }
  