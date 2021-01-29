import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import UserProfile from '/imports/ui/views/account/AccountView/UserProfile';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
    editIcon: {
      marginTop: 10,
    },
    avatar: {
      position: 'relative',
      width: 128,
      height: 128,
      // '&:hover' : {
      //   opacity : 0.5,
      // },
    },
  }));

export default function ProfileDialog(props) {
  const classes = useStyles();
  const {open} = props 
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {user} = props;

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        
        //onClose={props.closeDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{user ? "Edit user profile" : "Create new user"} 
        <IconButton aria-label="close" className={classes.closeButton} onClick={props.closeDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
        <UserProfile user={user} close={props.closeDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}