import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function YesNoDialog(props) {
  const { title, question, handleNo, open, handleYes, obj } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleNo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {question}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleYes(obj._id)} color="secondary">
            Yes
          </Button>
          <Button onClick={handleNo} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}