import React, { useState} from 'react';
import { Meteor } from 'meteor/meteor';
import CssBaseline from '@material-ui/core/CssBaseline';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Redirect, useNavigate
  } from "react-router-dom";
import 'react-image-crop/dist/ReactCrop.css';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Accounts } from 'meteor/accounts-base';
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



const ChangePassword = (props) => {
  const classes = useStyles();
  const { user } = props;
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      password: '',
      passwordConfirmation: ''
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      currentPassword: yup
      .string('Enter your current password')
      .required('Password is required!'),
      password: yup
        .string('Enter your email')
        .min(8, 'Password has to be longer than 8 characters!')
        .required('Password is required!'),
      passwordConfirmation: yup.string()
        .oneOf([yup.ref('password')], 'Passwords are not the same!')
        .required('Password confirmation is required!'),
    }),
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      Accounts.changePassword(values.currentPassword, values.password, (err) => {
        if(err){setErrors({account : "Error : " + err});
          setSubmitting(false);}
        else{
          setSubmitting(false);
          navigate(-1);
        }})
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        
      <Typography component="h1" variant="h4">
          Change my password
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
                fullWidth
                label="Current Password"
                margin="normal"
                name="currentPassword"
                type="password"
                variant="outlined"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                helperText={formik.touched.currentPassword && formik.errors.currentPassword}
              />
          <TextField
                fullWidth
                label="Password"
                margin="normal"
                name="password"
                type="password"
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
          <TextField
            fullWidth
            label="Confirm password"
            margin="normal"
            name="passwordConfirmation"
            type="password"
            variant="outlined"
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
            helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
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
                  {formik.isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />} Save
                </Button>
                
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
    </Container>
  );
}

export default ChangePassword;