import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Avatar from '@material-ui/core/Avatar';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import { useTracker } from 'meteor/react-meteor-data';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import {Images} from '/imports/api/images/images';

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
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
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

export default function AvatarPicker(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [image, setImage] = useState(null);

  const [files, setFiles] = useState();
  const [uploading, setUploading] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setHover] = useState(false);
  const [cropper, setCropper] = useState();
  const [cropData, setCropData] = useState("#");
  const [errorUpload, setErrorUpload] = useState();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: !inProgress,
  });
//each time cropData is updated, we upload the image
  useEffect(()=> {
    uploadItImages();
  },[cropData]);

  const {user, isLoading }  = useTracker(() =>  {
    let isLoading = true;
    const noDataAvailable = { user: {} };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    if(!props.user) { return noDataAvailable;} 
    const user = Meteor.users.findOne({'_id': props.user._id});
    const avatar = Images.findOne({'meta.objectId' : user._id});
    if(user && avatar) {user.avatar = avatar.link()} else { user.avatar = null}
    return { user, isLoading: false };  
  });  

  const handleClose = () => {
    setOpen(false);
  };
  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFiles(files);
      setImage(reader.result);
      setOpen(true);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL())
    }
  };
  const deleteAvatar = (userId) => {
    Meteor.call('avatar.remove', userId);
  }
  
  const uploadItImages = () => {

    if (cropData !== "#") {
      // We upload only one file, in case
      // there was multiple files selected
          //console.log("uploading file " + 1);
        let uploadInstance = Images.insert({
          file: cropData, // files[i],
          isBase64: true, // <— Mandatory
          fileName: user._id + '.png', // <— Mandatory
          type: 'image/png',
          meta: {
            objectId: user._id,
            imageType: "avatar",
          },
          streams: 'dynamic',
          chunkSize: 'dynamic',
          allowWebWorkers: true // If you see issues with uploads, change this to false
        }, false)
        setInProgress(true);
        setUploading(uploadInstance)

        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
          setErrorUpload(null)

          //console.log('Starting');
        })

        uploadInstance.on('end', function (error, fileObj) {
          //console.log('On end File Object: ', fileObj);
          setOpen(false);
        })

        uploadInstance.on('uploaded', function (error, fileObj) {
          //console.log('uploaded: ', fileObj);
          //const { enqueueSnackbar } = this.props
          // Remove the filename from the upload box
          //self.refs['fileinputImages'].value = '';
          //enqueueSnackbar('Files uploaded successfully', {variant: 'success'});
          // Reset our state for the next file
          setInProgress(false);
          setProgress(0)
          setUploading([])
        })

        uploadInstance.on('error', function (error, fileObj) {
          console.log('Error during upload: ' + error)
          setErrorUpload(error.message)
          //enqueueSnackbar('Error while Uploading the files', {variant: 'error'});
        });

        uploadInstance.on('progress', function (progress, fileObj) {
          console.log('Upload Percentage: ' + progress)
          // Update our progress bar
          setProgress(progress)
        });

        uploadInstance.start(); // Must manually start the upload
    }
  }

  return (
    <div>
      <Box
            className={classes.avatarbox}
            alignItems="center"
            display="flex"
            flexDirection="column"
            p={2}
          >
        {!inProgress && <Avatar
              className={classes.avatar}
              src={user && user.avatar ? user.avatar : cropData ? cropData : "/images/avatar_male.png"}
            />}
        {inProgress &&  <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" />
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                progress,
              )}%`}</Typography>
            </Box>
          </Box>}
        {!(user && user.avatar) && 
        <label className={classes.labelImg} htmlFor="upload-photo">
          <input
            style={{ display: 'none' }}
            id="upload-photo"
            name="upload-photo"
            type="file"
            accept="image/*" 
            onChange={onChange}
          />
          <Fab color="primary" size="small" component="span" aria-label="edit" className={classes.editIcon}>
          <EditIcon />
          </Fab>
            
        </label>}
        { (user && user.avatar) && <Fab color="primary" size="small" component="span" aria-label="edit" className={classes.editIcon}>
          <DeleteIcon onClick={() => deleteAvatar(user._id)}/>
          </Fab>}
          {errorUpload && <Typography
                    align="center"
                    color="error"
                    variant="body1"
                  >
                    {errorUpload}
          </Typography>}
      </Box>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Upload your avatar"}</DialogTitle>
        <DialogContent>
            <Cropper
            style={{ height: 400, width: "100%" }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            guides={true}
            minCropBoxHeight={100}
            minCropBoxWidth={100}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => {
                setCropper(instance);
            }}
            />

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={inProgress}
              onClick={getCropData}
            >
              Upload
            </Button>
            {inProgress && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}