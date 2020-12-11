// Methods related to Locations

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ProductsCollection } from './products.js';
import { Images } from '../images/images.js';
Meteor.methods({
  'products.upsert'(data, product_id) {
    //check if user is logged in
    if (! this.userId) {
      throw new Meteor.Error(403, "Access denied")
      }
    check(data, {
      name: String,
      description: String })
    if (!product_id) {
      data.createdAt = new Date();
      data.updatedAt = data.createdAt;
      return ProductsCollection.insert(
        data
      , function(error, result) {
        if(error){ console.log(error); return error;}
        if(result){ return "Product created successfully";
      }
      });
    }else{
      data.updatedAt = new Date();
      ProductsCollection.update(product_id,
        {$set: data
      }, function(error, result) {
        if(error){ console.log(error); return error}
          console.log(result);
          return result;
        //The list of errors is available on `error.invalidKeys` or by calling Books.simpleSchema().namedContext().validationErrors()
    });
    }
  },
  'products.remove'(id) {
    // Make sure the user is logged in before inserting a location and has role for it
    if (! this.userId) {
    throw new Meteor.Error(403, "Access denied")
    }
    //remove all realted images

    const images = Images.find({'meta.objectId': id});
    if (images) {
      images.map((item) => {
        Images.remove({_id: item._id})
      })
    }
    ProductsCollection.remove({_id:id}, function(err,res){
      if (err) {
        console.log(err);
        return err;
      }else {
        console.log(res);
        return res;
      }
    });

  },

});
