import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from '/imports/ui/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import { Images } from '/imports/api/images/images';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const UserListView = () => {
  const classes = useStyles();
  //const [users] = useState(data);
  const [filter, setFilter] = useState({});
  const {users, isLoading }  = useTracker(() =>  {
    let isLoading = true;
    const noDataAvailable = { users: [], avatar: [], isLoading };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('users.all');
    
    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const subscription = Meteor.subscribe('images.avatars')
    if (!subscription.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    
    const users = Meteor.users.find(filter).fetch();
    users.map(user => {
      let roles = Roles.getRolesForUser(user._id);
      user.roles = roles
    })
    const avatars = Images.find({}).fetch();
    users.map(user => {
      let avatar = Images.findOne({'meta.objectId' : user._id});
      if(avatar) {user.avatar = avatar.link()} else { user.avatar = null}
    });
    return { users, isLoading: false };
    
  });


  return (
    <Page
      className={classes.root}
      title="Users"
    >
      <Container maxWidth={false}>
        <Toolbar search={setFilter} users={users} />
        <Box mt={3}>
          <Results users={users} isLoading={isLoading} />
        </Box>
      </Container>
    </Page>
  );
};

export default UserListView;
