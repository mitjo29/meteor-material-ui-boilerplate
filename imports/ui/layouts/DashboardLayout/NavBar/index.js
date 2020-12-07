import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import AlertCircleIcon from '@material-ui/icons/Error';
import BarChartIcon from '@material-ui/icons/BarChart';
import LockIcon from '@material-ui/icons/Lock';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingBagIcon from '@material-ui/icons/ShoppingCart';
import UserIcon from '@material-ui/icons/Person';
import UserPlusIcon from '@material-ui/icons/PersonAdd';
import UsersIcon from '@material-ui/icons/People';

import { useTracker } from 'meteor/react-meteor-data';

import NavItem from './NavItem';

const useAccount = () => useTracker(() => {
  const user = Meteor.user()
  const userId = Meteor.userId()
  return {
    user,
    userId,
    isLoggedIn: !!userId
  }
}, [])

// const user = {
//   avatar: '/images/avatars/avatar_6.png',
//   jobTitle: 'Senior Developer',
//   name: 'Katarina Smith'
// };

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/users',
    icon: UsersIcon,
    title: 'Users'
  },
  // {
  //   href: '/app/products',
  //   icon: ShoppingBagIcon,
  //   title: 'Products'
  // },
  {
    href: '/app/profile',
    icon: UserIcon,
    title: 'Account'
  },
  // {
  //   href: '/app/settings',
  //   icon: SettingsIcon,
  //   title: 'Settings'
  // },
  {
    href: '/login',
    icon: LockIcon,
    title: 'Login'
  },
  {
    href: '/register',
    icon: UserPlusIcon,
    title: 'Register'
  },
  // {
  //   href: '/404',
  //   icon: AlertCircleIcon,
  //   title: 'Error'
  // }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = (props, { onMobileClose, openMobile}) => {
  const classes = useStyles();
  const location = useLocation();
  const { user, userId, isLoggedIn } = useAccount();
  const avatarlink = props.avatar ? Meteor.absoluteUrl() + props.avatar._downloadRoute + "/" + props.avatar._collectionName + "/" + props.avatar._id + "/original/" + props.avatar._id + "." + props.avatar.extension : undefined;
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={avatarlink}
          to="/app/profile"
        />
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {user ? user.firstName + " " + user.lastName : ""}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user && user.emails && user.emails[0] ? user.emails[0].address : ""}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
      <Box
        p={2}
        m={2}
        bgcolor="background.dark"
      >
        
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
  user: {},
  avatar : {}
};

export default NavBar;
