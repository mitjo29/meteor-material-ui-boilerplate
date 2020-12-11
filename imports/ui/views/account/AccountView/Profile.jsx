import React, { useState} from 'react';
import { Meteor } from 'meteor/meteor';
import CssBaseline from '@material-ui/core/CssBaseline';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Copyright} from '/imports/ui/components/copyright';
import UserProfile from '/imports/ui/views/account/AccountView/UserProfile';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Redirect, useNavigate
  } from "react-router-dom";
import 'react-image-crop/dist/ReactCrop.css';
import Page from '/imports/ui/components/Page';
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3),
      alignItems: 'center',
    },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const validationSchema = yup.object({
    firstName: yup
      .string('Enter your first name')
      .min(2, 'Firstname should of minimum 2 characters length')
      .required('Firstname is required'),
    lastName: yup
      .string('Enter your last name')
      .min(2, 'Lastname should of minimum 2 characters length')
      .required('Lastname is required'),
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
  });

const Profile = (props) => {
  const classes = useStyles();
  const [img, setImg] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imgSaved, setImgSaved] = useState("/images/avatar_male.png")
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const { user } = props;
  // const {user, avatar, isLoading }  = useTracker(() =>  {
  //   let isLoading = true;
  //   const noDataAvailable = { users: [], avatar: [], isLoading };
  //   if (!Meteor.user()) {
  //     return noDataAvailable;
  //   }
  //     const handler = Meteor.subscribe('users.current');
    
  //     if (!handler.ready()) {
  //       return { ...noDataAvailable, isLoading: true };
  //     }
  
  //     const subscription = Meteor.subscribe('images.avatar')
  //     if (!subscription.ready()) {
  //       return { ...noDataAvailable, isLoading: true };
  //     }
      
  //     const user = Meteor.users.findOne(
  //       {_id: Meteor.userId()
  //       }
  //     );
  //     const avatar = Images.findOne({'meta.objectId': Meteor.userId()});
  //     return { user, avatar, isLoading };
    
  // });

  let navigate = useNavigate();

  //const avatarlink = avatar ? Meteor.absoluteUrl() + avatar._downloadRoute + "/" + avatar._collectionName + "/" + avatar._id + "/original/" + avatar._id + "." + avatar.extension : undefined;
  return (
    <Page
    className={classes.root}
    title="Edit my profile"
    >
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
         <UserProfile user={user} close={() => navigate(-1)} />
      </div>
    </Container>
    </Page>
  );
}

export default Profile;