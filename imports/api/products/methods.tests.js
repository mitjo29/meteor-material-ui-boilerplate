// Tests for locations methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { ProductsCollection } from './products.js';
import './methods.js';

if (Meteor.isServer) {
  describe('products methods', function () {
    beforeEach(function () {
      ProductsCollection.remove({});
    });

    it('can add a new locations', function () {
      const addProducts = Meteor.server.method_handlers['products.insert'];

      addProducts.apply({}, ['meteor.com', 'https://www.meteor.com']);

      assert.equal(ProductsCollection.find().count(), 1);
    });
  });
}
