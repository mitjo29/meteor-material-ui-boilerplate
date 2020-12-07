import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Images } from './images.js';

Meteor.methods({
  'avatar.remove'(id) {
    if(! this.userId && !Roles.userIsInRole(loggedInUser,['Admin'])) {
      throw new Meteor.Error('not-authorized');
    }

      Images.remove({'meta.objectId': id}, function (error) {
        if (error) {
          console.error("File wasn't removed, error: " + error.reason)
        } else {
          console.info("File successfully removed");
        }
      });
    
  },
});
