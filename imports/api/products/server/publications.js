// All locations-related publications

import { Meteor } from 'meteor/meteor';
import { ProductsCollection } from '../products.js';
import { check } from 'meteor/check';

Meteor.publish('products.all', function () {
  var loggedInUser = Meteor.user()
  if (!loggedInUser) {
    return this.ready();
  }else {
    if(Roles.userIsInRole(loggedInUser,['Admin', 'User'])){
      return ProductsCollection.find();
    }else{
      return this.ready();
    }
  }

});

Meteor.publish('products', function (nb) {
  if (nb) {
    check(nb, Number);
    return ProductsCollection.find({_id: "123123"},{limit: nb});
  }else {
    return ProductsCollection.find({});
  }

});

Meteor.publish('products.filter', function (options) {
  console.log(options);

  if (options.filterNb) {
    check(options.filterNb, Number);
    check(options.filterDesignation, String);
    check(options.filterType, String);
    check(options.filterAddress, String);
    check(options.filterPostalCode, String);
    check(options.filterTown, String);
    check(options.filterCountry, String);
    return ProductsCollection.find({
                            designation: {$regex: options.filterDesignation, $options: 'i'},
                            type: {$regex: options.filterType, $options: 'i'},
                            address: {$regex: options.filterAddress, $options: 'i'},
                            postalCode: {$regex: options.filterPostalCode, $options: 'i'},
                            town: {$regex: options.filterTown, $options: 'i'},
                            country: {$regex: options.filterCountry, $options: 'i'}
                          },
                          {limit: options.filterNb, sort: {designation: 1, address: 1}});
  }else {
    return ProductsCollection.find({});
  }

});

Meteor.publish('products.findOne', function (id) {
  check(id, String);
  return ProductsCollection.find({_id: id});
});
