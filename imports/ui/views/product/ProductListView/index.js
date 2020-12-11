import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import clsx from 'clsx';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from '/imports/ui/components/Page';
import Toolbar from './Toolbar';
import ProductDialog from '/imports/ui/views/product/ProductListView/ProductDialog';
import ProductCard from './ProductCard';
import {ProductsCollection} from '/imports/api/products/products';
import { Images } from '/imports/api/images/images';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%',
  },
  selected: {
    borderColor: theme.palette.primary.light,
    borderStyle: "solid",
    borderWidth: "2px"
  }
}));

const ProductList = () => {
  const classes = useStyles();
  const [filter, setFilter] = useState({});
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const {products, isLoading }  = useTracker(() =>  {
    let isLoading = true;
    const noDataAvailable = { products: [], isLoading };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('products.all');
    
    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const subscription = Meteor.subscribe('files.products')
    if (!subscription.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    
    const products = ProductsCollection.find(filter).fetch();

    products.map(product => {
      let imageProduct = Images.findOne({'meta.objectId' : product._id});
      if(imageProduct) {product.imageProduct = imageProduct.link()} else { product.imageProduct = null}
    });
    return { products, isLoading: false };
    
  });
  const openDialog = (product) => {
    setSelectedProductId(product._id);
    setSelectedProduct(product);
    setOpenDialogForm(true);
  } 
  return (
    <Page
      className={classes.root}
      title="Products"
    >
      <Container maxWidth={false}>
        <Toolbar search={setFilter}  open={openDialogForm} setDialog={setOpenDialogForm} />
        <ProductDialog open={openDialogForm} setOpenDialogForm={setOpenDialogForm} product={selectedProduct} />
        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >
            {products.map((product) => (
              <Grid
                item
                key={product._id}
                lg={4}
                md={6}
                xs={12}
                onClick={() => setSelectedProductId(product._id)}
                onDoubleClick={() => openDialog(product)}
              >
                <ProductCard
                  className={clsx(classes.productCard, selectedProductId === product._id ? classes.selected : "")}
                  product={product}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          mt={3}
          display="flex"
          justifyContent="center"
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
        </Box>
      </Container>
    </Page>
  );
};

export default ProductList;
