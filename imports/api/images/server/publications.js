// All locations-related publications

import { Meteor } from 'meteor/meteor';
import { Images } from '../images.js';
import { check } from 'meteor/check';

Images.denyClient();
Meteor.publish('files.images.all', function () {
  return Images.find().cursor;
});

Meteor.publish('files.images', function (id, category) {
  var loggedInUser = true; //Meteor.user()
  if (!loggedInUser) {
    return this.ready();
  }else {
    //return Images.find({}).cursor;
    return Images.find({'meta.objectId': id, 'meta.imageType': category}).cursor;
  }

});
Meteor.publish('files.category', function (id) {
  var loggedInUser = true; //Meteor.user()
  if (!loggedInUser) {
    return this.ready();
  }else {
    //return Images.find({}).cursor;
    return Images.find({'meta.objectId': id, 'meta.imageType': "category"}).cursor;
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
