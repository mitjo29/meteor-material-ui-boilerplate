import React, { useState} from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import 'react-image-crop/dist/ReactCrop.css';
import AvatarPicker from '/imports/ui/components/avatarPicker' 
import Avatar from '@material-ui/core/Avatar';


  const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    width: 128,
    height: 128,
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const roles = ['User', 'Admin'];

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
    roles: yup
      .string('Role of the User')
      .required('User role is required'),
  });

const UserProfile = (props) => {
  const classes = useStyles();
  const {user} = props;
  const [img, setImg] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imgSaved, setImgSaved] = useState("/images/avatar_male.png")
  const [crop, setCrop] = useState({ aspect: 1 / 1 });

  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: user && user.firstName ? user.firstName : '',
      lastName: user && user.lastName ? user.lastName : '',
      email: user && user.emails && user.emails[0] ? user.emails[0].address : '',
      roles: user && user.roles && user.roles.length > 0 ? user.roles : ["User"]
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      if(user){
        const userId = Meteor.call('user.update', {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          roles: values.roles
        }, user._id, (err) => {
          if(err){setErrors({account : "Account not created : " + err});
          setSubmitting(false);}
          else{
            setSubmitting(false);
            props.close(false);
            //navigate(-1);
          }
        });
      }else{
        const userId = Meteor.call('user.add', {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          roles: values.roles
        }, (err) => {
          if(err){setErrors({account : "Account not created : " + err})
          setSubmitting(false);
          }
          else{
            setSubmitting(false);
            props.close(false);
            //navigate(-1);
          }
        });
      }
      
    },
  });

  //const avatarlink = avatar ? Meteor.absoluteUrl() + avatar._downloadRoute + "/" + avatar._collectionName + "/" + avatar._id + "/original/" + avatar._id + "." + avatar.extension : undefined;
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {!user && <Avatar
              className={classes.avatar}
              src={"/images/avatar_male.png"}
            />}
        {user && <AvatarPicker user={user} />}
        <Typography component="h1" variant="h5">
          { !user ? "New user profile" : user._id === Meteor.userId() ? "My profile" : " User profile" }
        </Typography>
        <Typography
                    align="center"
                    color="error"
                    variant="body1"
                  >
                    {formik.errors.account}
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
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          { ((user && user._id !== Meteor.userId()) || !user) && <FormControl className={classes.formControl}>
          <InputLabel htmlFor="user-roles">Roles</InputLabel>
            <Select
              value={formik.values.roles}
              fullWidth
              onChange={formik.handleChange}
              error={formik.touched.roles && Boolean(formik.errors.roles)}
              //helperText={formik.touched.email && formik.errors.email}
              inputProps={{
                name: 'roles',
                id: 'roles',
              }}
            >
              {roles.map((name) => (
                <MenuItem key={name} value={name} >
                  {name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formik.touched.email && formik.errors.email}</FormHelperText>
          </FormControl>}
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
                  {formik.isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />} Save
                </Button>
                
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                onClick={() => props.close(false)}
                className={classes.submit}
                disabled={formik.isSubmitting}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
          
        </form>
      </div>
    </Container>
  );
}

export default UserProfile;