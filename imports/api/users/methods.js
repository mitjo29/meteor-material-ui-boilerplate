// Methods related to users

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { Users } from './users.js';

Meteor.methods({
  'user.emailexists'(email){
    return Accounts.findUserByEmail(email);
  },
  'user.usernameexists'(username){
    return Accounts.findUserByUSername(username);
  },
  'user.add'(options){
    const loggedInUser = Meteor.user()

    if ((!loggedInUser || !Roles.userIsInRole(loggedInUser,['Admin']))) {
      throw new Meteor.Error(403, "You don't have permission to add a user")
    }
    console.log("Creating user: " + JSON.stringify(options));
    check(options, {
      email: String,
      firstName: String, 
      lastName: String,
      roles: [String],
    });
      const userExists = Accounts.findUserByEmail(options.email);
      if(userExists){
        throw new Meteor.Error('User already exists');
      }
      const user_id = Accounts.createUser({
              email: options.email,
          });
      Meteor.users.update(user_id, {$set: {firstName: options.firstName, lastName: options.lastName}})
      //Meteor.users.update({_id: user_id}, {$set:{'emails.0.verified': true}});
      //if (role != false && status != false) {
        //Roles.AddUsersToRoles(user_id, roles);
        Roles.setUserRoles(user_id, options.roles);
      //}
      return result = "User created successfully";
    //if(user_id) {
    //  Accounts.sendEnrollmentEmail(user_id);
    //  return user_id;}
  },
  'user.update'(options, userId){
    console.log("updating: " + JSON.stringify(options));
    const loggedInUser = Meteor.user()
    console.log(Roles.userIsInRole(loggedInUser,['Admin']));
    if ((!loggedInUser || !Roles.userIsInRole(loggedInUser,['Admin']))) {
      throw new Meteor.Error(403, "You don't have permission to modify this entry")
    }

    check(options, {
      email: String,
      firstName: String, 
      lastName: String,
      roles: [String],
    });
    const newEmail = [{address: options.email, verified : false}];
    Meteor.users.update({'_id': userId}, {$set: {'firstName': options.firstName, 'lastName': options.lastName, 'emails': newEmail}},  function(err, result) {
        if (err){
          console.log(err);
          return err;}
        else {
          console.log("user update successful");
          //update email
          const userOld = Meteor.users.findOne(userId);
          console.log(userOld);
          if(userOld) {
            
            if(userOld.emails[0]) {
              Accounts.removeEmail(userId, userOld.emails[0].address);
            }
            Accounts.addEmail(userId, options.email);
          }
          //Roles.AddUsersToRoles(user_id, roles);
          Roles.setUserRoles(userId, options.roles);
          return "user updated successfully";
          }
    });
  },
  'user.updateprofile'(options){
    console.log("updating: " + JSON.stringify(options));
    const user_id = Meteor.userId();
    console.log(user_id);
    Meteor.users.update({'_id': user_id}, {$set: {'firstName': options.firstName, 'lastName': options.lastName, 'emails.0.address': options.email}},  function(err, result) {
        if (err){
          console.log(err);
          return err;}
        else {
          console.log("user update successful");
          return "user updated successfully";
          }
    });
  },
  'user.remove' ( user_id){
    const loggedInUser = Meteor.user()
    if ((!loggedInUser || !Roles.userIsInRole(loggedInUser,['Admin']))) {
      throw new Meteor.Error(403, "You don't have permission to modify this entry")
    }
    
    check(user_id, String);

    Meteor.users.remove({_id: user_id});
  },
  "user.sendEnrollmentEmail"(id){
    Accounts.sendEnrollmentEmail(id);
  },
  'setUserState'(userId) {
    var loggedInUser = Meteor.user();
    if (!loggedInUser || !Roles.userIsInRole(loggedInUser._id,['admin'])) {
      throw new Meteor.Error(403, "Access denied");
    }
    check(userId, String);
    const userToChange = Meteor.users.findOne({_id: userId});
    if (userToChange) {
      const state = userToChange.roles[1];
      console.log(state);
      if (state == "enabled") {
        Roles.setUserRoles(userId, [userToChange.roles[0], 'disabled']);
        // Logout user
        Meteor.users.update({ _id: userId }, {$set: { "services.resume.loginTokens" : [] }});
      } else {
        console.log("enabling");
        Roles.setUserRoles(userId, [userToChange.roles[0], 'enabled']);
      }
    }

  }

});
