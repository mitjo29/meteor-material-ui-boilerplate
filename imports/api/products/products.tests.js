// Tests for the behavior of the locations collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { ProductsCollection } from './products.js';

if (Meteor.isServer) {
  describe('products collection', function () {
    it('insert correctly', function () {
      const productId = ProductsCollection.insert({
        name: 'new product',
        description: 'Description of the new product',
      });
      const added = ProductsCollection.findOne({ _id: productId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'products');
      assert.equal(count, 1);
    });
  });
}
