import { FilesCollection } from 'meteor/ostrio:files';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const pathToUpload = Meteor.settings.public.pathToUpload;
export const Images = new FilesCollection({
  collectionName: 'Images',
  debug: false,
  storagePath: Meteor.settings.public.pathToUpload ? Meteor.settings.public.pathToUpload : '/home/jocelyn/Pictures/assets', //pathToUpload,
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024*1024*2 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 2MB';
    }
  }
});

var mySchema = new SimpleSchema({
  objectId: {
    type: String,
  },
  imageType: {
    type: String
  }
});

var extendedSchema = _.extend(Images.schema, {
  meta : {type: mySchema}
});

Images.collection.attachSchema(extendedSchema);
