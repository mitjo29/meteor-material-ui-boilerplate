import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import ProfileDialog from '/imports/ui/views/account/AccountView/ProfileDialog';
import exportFromJSON from 'export-from-json'

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, search, users, ...rest }) => {
  const classes = useStyles();
  const [openUserProfile, setOpenUserProfile] = useState(false);
  const [searchField, setSearchField] = useState()

  handleChange = (event) => {
    setSearchField(event.target.value);
    const regex = new RegExp( event.target.value, 'i' );
    search({$or:[{'firstName' : {$regex : regex}}, {'lastName': {$regex : regex}}]});
  }

  const exportJSON = () => {
    const data = users
    const fileName = 'download'
    const exportType = 'csv'
    
    exportFromJSON({ data, fileName, exportType })
  } 
  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <ProfileDialog open={openUserProfile} closeDialog={setOpenUserProfile}/>
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button className={classes.importButton}>
          Import
        </Button>
        <Button className={classes.exportButton} onClick={exportJSON} >
          Export
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpenUserProfile(true)}
        >
          Add user
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                //value={searchField}
                placeholder="Search user"
                variant="outlined"
                onChange={handleChange}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
