import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/users/methods.js';
import '/imports/api/users/server/publications.js';
import '/imports/api/images/methods.js';
import '/imports/api/images/server/publications.js';
import '/imports/api/products/methods.js';
import '/imports/api/products/server/publications.js';
import {ProductsCollection} from '/imports/api/products/products.js';

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
    Meteor.users.update(userId, {$set: {firstName: 'Admin', lastName: 'Admin'}})
    Roles.setUserRoles(userId, ["Admin"]);
  }
  //publish custom fields for user
  Meteor.publish(null, function() {
    return Meteor.users.find({_id: this.userId}, {fields: {firstName: 1, lastName: 1, emails: 1}});
  });
  // Meteor.publish(null, function (){
  //   return Meteor.roles.find({})
  // });
  //check if products exists

  if(ProductsCollection.find({}).count() < 1) {
    console.log("Creating default product");
    const array = [
      {
        name: 'Product 1',
        description : 'Description of product 1'
      },
      {
        name: 'Product 2',
        description : 'Description of product 2'
      },
      {
        name: 'Product 3',
        description : 'Description of product 3'
      },
      {
        name: 'Product 4',
        description : 'Description of product 4'
      },
      {
        name: 'Product 5',
        description : 'Description of product 5'
      },
      {
        name: 'Product 6',
        description : 'Description of product 6'
      },
    ]
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      element.createdAt = new Date();
      element.updatedAt = element.createdAt;
      ProductsCollection.insert(element)
    }
    ProductsCollection
  }
});
