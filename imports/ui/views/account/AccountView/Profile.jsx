import React, { useState} from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/Lock';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Copyright} from '/imports/ui/components/copyright';
import ProfileAvatar from '/imports/ui/components/avatar';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Redirect, useNavigate
  } from "react-router-dom";
import 'react-image-crop/dist/ReactCrop.css';
import AvatarPicker from '/imports/ui/components/avatarPicker' 
import {Images} from '/imports/api/images/images';
import { PinDropSharp } from '@material-ui/icons';

  const useStyles = makeStyles((theme) => ({
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

const Profile = () => {
  const classes = useStyles();
  const [img, setImg] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imgSaved, setImgSaved] = useState("/images/avatar_male.png")
  const [crop, setCrop] = useState({ aspect: 1 / 1 });

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

  let navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: user && user.firstName ? user.firstName : '',
      lastName: user && user.lastName ? user.lastName : '',
      email: user && user.emails ? user.emails[0].address : '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      console.log(values);
      setSubmitting(true);
      const userId = Meteor.call('user.updateprofile', {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
      }, (err) => {
        if(err){setErrors({account : "Account not created : " + err})}
        else{
          navigate(-1);
        }
      });
    },
  });

  const avatarlink = avatar ? Meteor.absoluteUrl() + avatar._downloadRoute + "/" + avatar._collectionName + "/" + avatar._id + "/original/" + avatar._id + "." + avatar.extension : undefined;
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
          <AvatarPicker user={user} avatar={avatarlink} />
        <Typography component="h1" variant="h5">
          My profile
        </Typography>
        <Typography
                    align="center"
                    color="error"
                    variant="body1"
                  >
                    {formik.errors.login}
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="firstName"
            label="Firstname "
            name="firstName"
            autoFocus
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="lastName"
            label="Lastname "
            name="lastName"
            autoFocus
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={formik.isSubmitting}
                >
                  Save
                </Button>
                {formik.isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                onClick={() => navigate(-1)}
                className={classes.submit}
                disabled={formik.isSubmitting}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
          
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default Profile;