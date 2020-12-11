// All locations-related publications

import { Meteor } from 'meteor/meteor';
import { Images } from '../images.js';
import { check } from 'meteor/check';

Images.denyClient();
Meteor.publish('files.images.all', function () {
  return Images.find().cursor;
});

Meteor.publish('files.images', function (id, product) {
  var loggedInUser = true; //Meteor.user()
  if (!loggedInUser) {
    return this.ready();
  }else {
    //return Images.find({}).cursor;
    return Images.find({'meta.objectId': id, 'meta.imageType': product}).cursor;
  }

});
Meteor.publish('files.products', function (id) {
  const loggedInUser = Meteor.user()
  if (!loggedInUser) {
    return this.ready();
  }else {
    //return Images.find({}).cursor;
    if(id){
      return Images.find({'meta.objectId': id, 'meta.imageType': "product"}).cursor;
    }else{
      return Images.find({'meta.imageType': "product"}).cursor;
    }
    
  }

});

Meteor.publish('images.avatar', function () {
  var loggedInUser = Meteor.user();
  if (!loggedInUser) {
    return this.ready();
  }else {
    //return Images.find({}).cursor;
    return Images.find({'meta.objectId': loggedInUser._id, 'meta.imageType': "avatar"}).cursor;
  }

})
Meteor.publish('images.avatars', function () {
  var loggedInUser = Meteor.user();
  if (!loggedInUser) {
    return this.ready();
  }else {
    //return Images.find({}).cursor;
    return Images.find({'meta.imageType': "avatar"}).cursor;
  }

})
Meteor.publish('files.', function () {
  var loggedInUser = Meteor.user();
  if (!loggedInUser) {
    return this.ready();
  }else {
    //return Images.find({}).cursor;
    return Images.find({'meta.objectId': loggedInUser._id, 'meta.imageType': "avatar"}).cursor;
  }

});
