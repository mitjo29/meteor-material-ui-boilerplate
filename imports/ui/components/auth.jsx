import React from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';

export default function AuthMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const user = useTracker(() => Meteor.user());
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    Meteor.logout();
    setAnchorEl(null);
  };
  if(user){
    return (
      <div><IconButton color="inherit" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
                <AccountCircleIcon />
            </IconButton>
        <Menu
          id="fade-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem component={Link} to="/profile">Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>);
  }else{
    return (<Button
      component={Link}
      color="secondary"
      to="/signin"
    >
      Sign in
    </Button>)
  }
}