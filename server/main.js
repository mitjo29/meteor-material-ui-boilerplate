import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { Accounts } from 'meteor/accounts-base';

function insertLink({ title, url }) {
  LinksCollection.insert({title, url, createdAt: new Date()});
}

Meteor.startup(() => {
  if (!Accounts.findUserByUsername('admin')) {
    const userId = Accounts.createUser({
      username: 'admin',
      password: 'admin',
    });
    Accounts.addEmail(userId, 'admin@admin.com', true)
  }

});
