import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

export const ProductsCollection = new Mongo.Collection('products');

ProductsCollection.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    optional: false,
    max: 200
  },
  description: {
    type: String,
    label: "Description",
    optional: true,
    max: 1000
  },
  createdAt: {
    type: Date,
    label: "Date of creation",
    optional: false
  },
  createdAt: {
    type: Date,
    label: "Date of last update",
    optional: false
  },
}, { tracker: Tracker }));
