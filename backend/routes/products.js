const { Category } = require('../models/category');
const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * GET = http://localhost:3000/api/v1/products
 * GET = http://localhost:3000/api/v1/products?categories=categories_id
 */
// router.get('/', async (req, res) => {
//   let filter = {};
//   if (req.query.categories) {
//     filter = { category: req.query.categories.split(',') };
//   }
//   // const productList = await Product.find().select('name image -_id');
//   const productList = await Product.find(filter).populate('category');

//   if (!productList) {
//     res.status(500).json({ success: false });
//   }
//   res.status(200).send(productList);
// });
router.get('/', (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }

  Product.find(filter)
    .populate('category')
    .then((productList) => {
      if (!productList) {
        res.status(500).json({ success: false });
      }
      res.status(200).send(productList);
    })
    .catch((error) => {
      // Handle product lookup error
      res
        .status(500)
        .send('An error occurred while fetching the product list.');
    });
});

/**
 * GET = http://localhost:3000/api/v1/products/:id
 */
// router.get('/:id', async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) {
//     res.status(404).json({ success: false, message: 'Product not found' });
//   }
//   res.status(200).send(product);
// });
router.get('/:id', (req, res) => {
  Product.findById(req.params.id)
    .populate('category')
    .then((product) => {
      if (product) {
        return res.status(200).send(product);
      } else {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        error: err,
      });
    });
});

/**
 * POST = http://localhost:3000/api/v1/products
 */
// router.post('/', async (req, res) => {
//   const category = await Category.findById(req.body.category);
//   if (!category) {
//     return res.status(400).send('Invalid Category');
//   }

//   let product = new Product({
//     name: req.body.name,
//     description: req.body.description,
//     richDescription: req.body.richDescription,
//     image: req.body.image,
//     brand: req.body.brand,
//     price: req.body.price,
//     category: req.body.category,
//     countInStock: req.body.countInStock,
//     rating: req.body.rating,
//     numReviews: req.body.numReviews,
//     isFeatured: req.body.isFeatured,
//   });
//   product = await product.save();
//   if (!product) {
//     return res.status(404).send('The product cannot be created!');
//   }
//   res.status(201).send(product);
// });
router.post('/', (req, res) => {
  Category.findById(req.body.category)
    .then((category) => {
      if (!category) {
        return res.status(400).send('Invalid Category');
      }

      let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      });

      product
        .save()
        .then((savedProduct) => {
          if (!savedProduct) {
            return res.status(404).send('The product cannot be created!');
          }
          res.status(201).send(savedProduct);
        })
        .catch((error) => {
          // Handle product save error
          res.status(500).send('An error occurred while saving the product.');
        });
    })
    .catch((error) => {
      // Handle category lookup error
      res.status(500).send('An error occurred while looking up the category.');
    });
});

/**
 * PUT = http://localhost:3000/api/v1/products/:id
 */
// router.put('/:id', async (req, res) => {
//   if (!mongoose.isValidObjectId(req.params.id)) {
//     res.status(400).send('Invalid Product Id');
//   }
//   const category = await Category.findById(req.body.category);
//   if (!category) {
//     return res.status(400).send('Invalid Category');
//   }
//   const product = await Product.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       description: req.body.description,
//       richDescription: req.body.richDescription,
//       image: req.body.image,
//       brand: req.body.brand,
//       price: req.body.price,
//       category: req.body.category,
//       countInStock: req.body.countInStock,
//       rating: req.body.rating,
//       numReviews: req.body.numReviews,
//       isFeatured: req.body.isFeatured,
//     },
//     { new: true }
//   );
//   if (!product) {
//     return res.status(400).send('The product cannot be updated!');
//   }
//   res.status(201).send(product);
// });
router.put('/:id', (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id');
  }

  Category.findById(req.body.category)
    .then((category) => {
      if (!category) {
        return res.status(400).send('Invalid Category');
      }

      Product.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
          richDescription: req.body.richDescription,
          image: req.body.image,
          brand: req.body.brand,
          price: req.body.price,
          category: req.body.category,
          countInStock: req.body.countInStock,
          rating: req.body.rating,
          numReviews: req.body.numReviews,
          isFeatured: req.body.isFeatured,
        },
        { new: true }
      )
        .then((product) => {
          if (!product) {
            return res.status(400).send('The product cannot be updated!');
          }
          res.status(201).send(product);
        })
        .catch((error) => {
          // Handle product update error
          res.status(500).send('An error occurred while updating the product.');
        });
    })
    .catch((error) => {
      // Handle category lookup error
      res.status(500).send('An error occurred while looking up the category.');
    });
});

/**
 * DELETE = http://localhost:3000/api/v1/products/:id
 */
router.delete('/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: 'The product is deleted!',
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'product not found',
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        error: err,
      });
    });
});

/**
 * GET = http://localhost:3000/api/v1/products/get/count
 */
router.get('/get/count', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      return res.status(500).json({ success: false });
    }

    res.status(200).json({
      productCount: productCount,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET = http://localhost:3000/api/v1/products/get/featured/:count
 */
router.get('/get/featured/:count', async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true })
    .populate('category')
    .limit(+count);
  if (!products) {
    return res.status(500).json({ success: false });
  }
  res.status(200).send(products);
});

module.exports = router;
