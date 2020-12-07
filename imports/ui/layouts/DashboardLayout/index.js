import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import {Images} from '/imports/api/images/images';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = (props) => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
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

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        user={props.user}
        avatar={avatar}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Fade in={true} ><Outlet /></Fade>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
