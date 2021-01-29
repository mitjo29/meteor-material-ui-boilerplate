// All communities-related publications

import { Meteor } from 'meteor/meteor';
import { Users } from '../users.js';
import { check } from 'meteor/check';
import { Images } from '/imports/api/images/images';

// publish only the content of the current user logged (incl. avatar)
Meteor.publish('users.current', function() {
  if (!this.userId) {
    return this.ready();
  }
  const user = Meteor.users.find({_id: this.userId}, {fields: {
    emails: 1,
    firstName: 1,
    lastName: 1,
    roles: 1,
  }});
  // const avatar = Images.findOne({'meta.objectId' : this.userId});
  // if(avatar) {user.avatar = avatar.link()} else { user.avatar = null}
  const image = Images.find({'meta.objectId' : this.userId}).cursor;
  return [user,
    image,
    Meteor.roles.find({}),
    Meteor.roleAssignment.find({ 'user._id': this.userId })];
});

Meteor.publish('users.all', function() {

  var loggedInUser = Meteor.userId()
  if (!loggedInUser || !Roles.userIsInRole(loggedInUser,['Admin'])) {
  //if (!loggedInUser) {
    return this.ready();
  }else {
    const users = Meteor.users.find({}, {fields: {
      emails: 1,
      firstName: 1,
      lastName: 1,
      roles: 1
    }});
    const avatars = Images.find({'meta.imageType' : 'Avatar'}).cursor;
    return [users,
    avatars,
    //Meteor.roles.find(),
    Meteor.roleAssignment.find()
    ]
  }



});
