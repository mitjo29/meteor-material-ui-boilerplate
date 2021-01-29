import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import clsx from 'clsx';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination';
import Page from '/imports/ui/components/Page';
import Toolbar from './Toolbar';
import ProductDialog from '/imports/ui/views/product/ProductListView/ProductDialog';
import ProductCard from './ProductCard';
import {ProductsCollection} from '/imports/api/products/products';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {products, isLoading, isLoadingPictures, totalProducts }  = useTracker(() =>  {
    let isLoading = true;
    let isLoadingPictures = true;
    const noDataAvailable = { products: [], isLoading, isLoadingPictures };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('products.all');
    
    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true, isLoadingPictures: true };
    }
    noDataAvailable.isLoading = false
    const subscription = Meteor.subscribe('files.products')
    if (!subscription.ready()) {
      return { ...noDataAvailable, isLoadingPictures: true };
    }

    const totalProducts = ProductsCollection.find().count();
    skips = rowsPerPage * (page)
    const products = ProductsCollection.find(filter, {skip: skips, limit: rowsPerPage}).fetch();

    // products.forEach(product => {
    //   let imageProduct = Images.findOne({'meta.objectId' : product._id});
    //   if(imageProduct) {product.imageProduct = imageProduct.link()} else { product.imageProduct = null}
    // }) //. then(noDataAvailable.isLoadingPictures = false);
    return { ...noDataAvailable, isLoadingPictures: false, totalProducts, products};
    
  });
//pagination

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openDialog = (product) => {
    setSelectedProductId(product._id);
    setSelectedProduct(product);
    setOpenDialogForm(true);
  } 
console.log(products);
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
            {!isLoading &&  products.map((product) => (
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
                  isLoadingPictures={isLoadingPictures}
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
         {!isLoading && <TablePagination
            component="div"
            count={totalProducts ? totalProducts : 0}
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />}
        </Box>
      </Container>
    </Page>
  );
};

export default ProductList;
