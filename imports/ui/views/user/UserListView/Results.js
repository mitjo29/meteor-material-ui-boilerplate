import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import getInitials from '/imports/ui/utils/getInitials';
import ProfileDialog from '/imports/ui/views/account/AccountView/ProfileDialog';
import Skeleton from '@material-ui/lab/Skeleton';
import YesNoDialog from '../../../components/YesNoDialog';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, users, isLoading, ...rest }) => {
  const classes = useStyles();
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openUserProfile, setOpenUserProfile] = useState(false);
  const [editUser, setEditUser ] = useState({});

  const [openYesNo, setOpenYesNo] = useState(false)

  const handleSelectAll = (event) => {
    let newSelectedUserIds;

    if (event.target.checked) {
      newSelectedUserIds = users.map((user) => user.id);
    } else {
      newSelectedUserIds = [];
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
        selectedUserIds.slice(0, selectedIndex),
        selectedUserIds.slice(selectedIndex + 1)
      );
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const editUserProfile = (user) => {
    setEditUser(user);
    setOpenUserProfile(true)
    
    //setEditUserAvatar(avatarlink);
    //setEditUserRole(Roles.getRolesForUser(user));
  }

  const deleteUser = (user) => {
    setEditUser(user);
    setOpenYesNo(true);

};
    const handleYes = (id) => {
      console.log("handle yes");
      Meteor.call('user.remove', id, (err, res) => {
        if(err) {
          setOpenYesNo(false);
        }else{
          setOpenYesNo(false);
        }
      })
      
  };

  const handleNo = () => {
    console.log("handle no");
    setOpenYesNo(false);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <ProfileDialog open={openUserProfile} user={editUser} closeDialog={setOpenUserProfile}/>
      <YesNoDialog open={openYesNo} question={"Do you want to delete : "} handleNo={handleNo} handleYes={handleYes} obj={editUser} />
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUserIds.length === users.length}
                    color="primary"
                    indeterminate={
                      selectedUserIds.length > 0
                      && selectedUserIds.length < users.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Role
                </TableCell>
                <TableCell>
                  Registration date
                </TableCell>
                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading ? users.slice(0, limit).map((user) => {
                //const avatar = Images.findOne({'meta.objectId': user._id});
                //const avatarlink = avatar ? Meteor.absoluteUrl() + avatar._downloadRoute + "/" + avatar._collectionName + "/" + avatar._id + "/original/" + avatar._id + "." + avatar.extension : '/images/avatar_male.png';
                return (
                <TableRow
                  hover
                  key={user._id}
                  selected={selectedUserIds.indexOf(user._id) !== -1}
                  onDoubleClick={() => editUserProfile(user)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUserIds.indexOf(user._id) !== -1}
                      onChange={(event) => handleSelectOne(event, user._id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Avatar
                        className={classes.avatar}
                        src={user.avatar}
                      >
                        {getInitials(user.firstName + ' ' + user.lastName)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {user.firstName + ' ' + user.lastName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.emails && user.emails[0] ? user.emails[0].address : ''}
                  </TableCell>
                  <TableCell>
                    {user && user.roles ? user.roles.map(role => role) : ''}
                  </TableCell>
                  <TableCell>
                    {user ? moment(user.createdAt).format('DD/MM/YYYY') : ""}
                  </TableCell>
                  <TableCell>
                    <IconButton color="secondary" aria-label="delete" onClick={() => deleteUser(user)} >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => editUserProfile(user)}  color="primary" aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
              ) : <TableRow>
                    <TableCell><Skeleton height={70}/></TableCell>
                    <TableCell>
                      <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Skeleton variant="circle"/>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        <Skeleton height={48} width={100}/>
                      </Typography>
                    </Box>
                    </TableCell>
                    <TableCell><Skeleton height={70}/></TableCell>
                    <TableCell><Skeleton height={70}/></TableCell>
                    <TableCell><Skeleton height={70}/></TableCell>
                    <TableCell><Skeleton height={70}/></TableCell>
                    </TableRow>}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={users.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default Results;
