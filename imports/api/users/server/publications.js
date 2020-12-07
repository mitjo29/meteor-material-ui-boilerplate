// All communities-related publications

import { Meteor } from 'meteor/meteor';
import { Users } from '../users.js';
import { check } from 'meteor/check';

// publish only the content of the current user logged
Meteor.publish('users.current', function() {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find({_id: this.userId}, {fields: {
    emails: 1,
    firstName: 1,
    lastName: 1,
    roles: 1,
  }});
});

Meteor.publish('users.all', function() {

  var loggedInUser = Meteor.user()
  if ((!loggedInUser || !Roles.userIsInRole(loggedInUser,['Admin']))) {
  //if (!loggedInUser) {
    return this.ready();
  }else {
    return [Meteor.users.find({}, {fields: {
      emails: 1,
      firstName: 1,
      lastName: 1,
      roles: 1
    }}),
    Meteor.roles.find(),
    Meteor.roleAssignment.find()]
  }



});
