import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import UserProfile from '/imports/ui/views/account/AccountView/UserProfile';

const useStyles = makeStyles((theme) => ({
    // avatarbox: {
    //   "&:hover $editIcon": {
    //     display: 'block'
    //   }
    // },
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
        onClose={props.closeDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Edit profile {props.userId}</DialogTitle>
        <DialogContent>
        <UserProfile user={user} closeDialog={props.closeDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}