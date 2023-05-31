const { Category } = require('../models/category');
const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid image type');

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

/**
 * GET = http://localhost:3000/api/v1/products
 * GET = http://localhost:3000/api/v1/products?categories=categories_id
 */
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
router.post('/', uploadOptions.single('image'), (req, res) => {
  Category.findById(req.body.category)
    .then((category) => {
      if (!category) {
        return res.status(400).send('Invalid Category');
      }

      const file = req.file;
      if (!file) {
        return res.status(400).send('No image in the request');
      }
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`, // "http://localhost:3000/public/uploads/image-1685559486556"
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
router.put('/:id', uploadOptions.single('image'), (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id');
  }

  Category.findById(req.body.category)
    .then((category) => {
      if (!category) {
        return res.status(400).send('Invalid Category');
      }

      return Product.findById(req.params.id);
    })
    .then((product) => {
      if (!product) {
        return res.status(400).send('Invalid Product!');
      }

      const file = req.file;
      let imagePath;

      if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagePath = `${basePath}${fileName}`;
      } else {
        imagePath = product.image;
      }

      return Product.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
          richDescription: req.body.richDescription,
          image: imagePath,
          brand: req.body.brand,
          price: req.body.price,
          category: req.body.category,
          countInStock: req.body.countInStock,
          rating: req.body.rating,
          numReviews: req.body.numReviews,
          isFeatured: req.body.isFeatured,
        },
        { new: true }
      );
    })
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(400).send('The product cannot be updated!');
      }
      res.status(201).send(updatedProduct);
    })
    .catch((error) => {
      // Handle product update error
      res.status(500).send('An error occurred while updating the product.');
    });
});

/**
 * PUT = http://localhost:3000/api/v1/products/gallery-images/:id
 */

router.put(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Product Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    )
      .then((product) => {
        if (!product) {
          return res.status(500).send('The gallery cannot be updated!');
        }
        res.send(product);
      })
      .catch((error) => {
        res.status(500).send('An error occurred while updating the gallery.');
      });
  }
);

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
router.get('/get/featured/:count', (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  Product.find({ isFeatured: true })
    .populate('category')
    .limit(+count)
    .then((products) => {
      if (!products) {
        res.status(500).json({ success: false });
      }
      res.status(200).send(products);
    })
    .catch((error) => {
      // Handle error here
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching featured products',
      });
    });
});

module.exports = router;

// {
//     "name": "Product-4",
//     "description": "Product-4 description",
//     "richDescription": "Product-4 long description",
//     "image": "some_url",
//     "brand": "Product-4 brand",
//     "price": 25,
//     "category": "64725ab44c349d55599de477",
//     "countInStock": 10,
//     "rating": 4,
//     "numReviews": 22,
//     "isFeatured": true
// }
