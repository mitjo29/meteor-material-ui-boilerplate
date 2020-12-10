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
import ListSubheader from '@material-ui/core/ListSubheader';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import LockIcon from '@material-ui/icons/Lock';
import ShoppingBagIcon from '@material-ui/icons/ShoppingCart';
import UserIcon from '@material-ui/icons/Person';
import UserPlusIcon from '@material-ui/icons/PersonAdd';
import UsersIcon from '@material-ui/icons/People';
import IconButton from '@material-ui/core/IconButton';
import InputIcon from '@material-ui/icons/Input';
import PersonIcon from '@material-ui/icons/Person';

import { useTracker } from 'meteor/react-meteor-data';

import NavItem from './NavItem';

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
    href: '/app/products',
    icon: ShoppingBagIcon,
    title: 'Products'
  },
  // {
  //   href: '/app/profile',
  //   icon: UserIcon,
  //   title: 'Account'
  // },
  // {
  //   href: '/app/settings',
  //   icon: SettingsIcon,
  //   title: 'Settings'
  // },
  // {
  //   href: '/login',
  //   icon: LockIcon,
  //   title: 'Login'
  // },
  // {
  //   href: '/register',
  //   icon: UserPlusIcon,
  //   title: 'Register'
  // },
  // {
  //   href: '/404',
  //   icon: AlertCircleIcon,
  //   title: 'Error'
  // }
];

const itemsAdmin = [
  {
    href: '/app/users',
    icon: UsersIcon,
    title: 'Users'
  },
]

const itemsUser = [
  {
    href: '/app/profile',
    icon: SettingsIcon,
    title: 'Modify my profile'
  },
  {
    href: '/app/changepassword',
    icon: LockIcon,
    title: 'Change my password'
  },
]

const useStyles = makeStyles((theme) => ({
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
  },
  userMenu: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const NavBar = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const {openMobile, onMobileClose, user} = props;

  //const avatarlink = props.avatar ? Meteor.absoluteUrl() + props.avatar._downloadRoute + "/" + props.avatar._collectionName + "/" + props.avatar._id + "/original/" + props.avatar._id + "." + props.avatar.extension : undefined;
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
      {openMobile && <div>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={1}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={user.avatar}
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
        <div className={classes.userMenu}>
          <IconButton color="secondary" aria-label="Modify profile" component={RouterLink} to="/app/profile">
            <SettingsIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="logout" color="primary" onClick={()=> Meteor.logout()}>
            <InputIcon fontSize="small" />
          </IconButton>
        </div>
      </Box>
      <Divider />
      </div>}
      <Box p={1}>
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
      <Divider />
      <Box p={1}>
        <List subheader={<ListSubheader>Administration</ListSubheader>}>
          {itemsAdmin.map((item) => (
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
      <Divider />
      <Box
        p={1}
      >
        <List subheader={<ListSubheader>Settings</ListSubheader>}>
          {itemsUser.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
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
