import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import 'react-image-crop/dist/ReactCrop.css';
import ImagePicker from '/imports/ui/components/imagePicker'
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import YesNoDialog from '../../../components/YesNoDialog';

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

const validationSchema = yup.object({
  name: yup
    .string('Enter your first name')
    .min(2, 'Firstname should of minimum 2 characters length')
    .required('Firstname is required'),
  description: yup
    .string('Enter your last name')
    .min(2, 'Lastname should of minimum 2 characters length')
    .required('Lastname is required')
});

const ProductForm = (props) => {
  const classes = useStyles();
  const { product } = props;
  const [openYesNo, setOpenYesNo] = useState(false)
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: product && product.name ? product.name : '',
      description: product && product.description ? product.description : '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      if (product) {
        const productId = Meteor.call('products.upsert', {
          name: values.name,
          description: values.description,
        }, product._id, (err) => {
          if (err) {
            setErrors({ account: "Product not updated : " + err });
            setSubmitting(false);
          }
          else {
            setSubmitting(false);
            props.close(false);
            //navigate(-1);
          }
        });
      } else {
        const productId = Meteor.call('products.upsert', {
          name: values.name,
          description: values.description,
        }, (err) => {
          if (err) {
            setErrors({ account: "Product not created : " + err })
            setSubmitting(false);
          }
          else {
            setSubmitting(false);
            props.close(false);
            //navigate(-1);
          }
        });
      }

    },
  });
  const deleteProduct = () => {
    setOpenYesNo(true);

};
  const handleYes = (id) => {
    console.log("handle yes");
    Meteor.call('products.remove', id, (err, res) => {
      if(err) {
        setOpenYesNo(false);
      }else{
        setOpenYesNo(false);
        props.close(false)
      }
    })
    
};

const handleNo = () => {
  console.log("handle no");
  setOpenYesNo(false);
};

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {product && <YesNoDialog open={openYesNo} title={"Delete a product?"} question={"Do you want to delete the product: " + product.name} handleNo={handleNo} handleYes={handleYes} obj={product} />}
      <div className={classes.paper}>
        {product && <ImagePicker collectionId={product._id} imageType={"product"} />}
        <Typography component="h1" variant="h5">
          {!product ? "New product" : " Edit product"}
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
            id="name"
            label="Name "
            name="name"
            autoFocus
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="description"
            label="Description "
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                onClick={deleteProduct}
                className={classes.submit}
                disabled={formik.isSubmitting}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={formik.isSubmitting}
                startIcon={<SaveIcon />}
              >
                {formik.isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />} Save
                </Button>
                </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                color="default"
                onClick={() => props.close(false)}
                className={classes.submit}
                disabled={formik.isSubmitting}
                startIcon={<CancelIcon />}
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

export default ProductForm;