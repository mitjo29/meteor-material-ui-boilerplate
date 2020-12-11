import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/users/methods.js';
import '/imports/api/users/server/publications.js';
import '/imports/api/images/methods.js';
import '/imports/api/images/server/publications.js';
import '/imports/api/products/methods.js';
import '/imports/api/products/server/publications.js';

Meteor.startup(() => {
  Roles.createRole("Admin", {unlessExists: true});
  Roles.createRole("User", {unlessExists: true});
  if (!Accounts.findUserByUsername('admin')) {
    const userId = Accounts.createUser({
      username: 'admin',
      firstName: 'My',
      lastName: 'Admin',
      password: 'admin',
      email: 'admin@admin.com'
    });
    //Accounts.addEmail(userId, 'admin@admin.com', true)
    Roles.addUsersToRoles(userId, "Admin")
  }
  //publish custom fields for user
  Meteor.publish(null, function() {
    return Meteor.users.find({_id: this.userId}, {fields: {firstName: 1, lastName: 1, emails: 1}});
  });
  Meteor.publish(null, function (){
    return Meteor.roles.find({})
  });
});
