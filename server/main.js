import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/users/methods.js';
import '/imports/api/users/server/publications.js';
import '/imports/api/images/methods.js';
import '/imports/api/images/server/publications.js';
import { RotateLeftSharp } from '@material-ui/icons';

function insertLink({ title, url }) {
  LinksCollection.insert({title, url, createdAt: new Date()});
}

Meteor.startup(() => {
  Roles.createRole("Admin", {unlessExists: true});
  Roles.createRole("User", {unlessExists: true});
  if (!Accounts.findUserByUsername('admin')) {
    const userId = Accounts.createUser({
      username: 'admin',
      firstName: 'My',
      lastNAme: 'Admin',
      password: 'admin',
      email: 'admin@admin.com'
    });
    //Accounts.addEmail(userId, 'admin@admin.com', true)
    Roles.addUsersToRoles(userId, "Admin")
  }
  //publish custom fields for user
  Meteor.publish(null, function() {
    return Meteor.users.find({_id: this.userId}, {fields: {firstName: 1, lastNAme: 1, emails: 1}});
  });
});
