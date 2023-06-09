const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

/**
 * GET = http://localhost:3000/api/v1/categories
 */
router.get('/', (req, res) => {
  Category.find(req.params.id)
    .then((categoryList) => {
      if (categoryList) {
        return res.status(200).send(categoryList);
      } else {
        return res.status(500).json({
          success: false,
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
 * GET = http://localhost:3000/api/v1/categories/:id
 */
router.get('/:id', (req, res) => {
  Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).send(category);
      } else {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
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
 * POST = http://localhost:3000/api/v1/categories
 */
router.post('/', (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
    image: req.body.image,
  });

  category
    .save()
    .then((category) => {
      if (!category) {
        return res.status(404).send('The category cannot be created!');
      }
      res.status(201).send(category);
    })
    .catch((error) => {
      // Handle any error that occurred during the save process
      console.error(error);
      res.status(500).send('An error occurred while creating the category.');
    });
});

/**
 * PUT = http://localhost:3000/api/v1/categories/:id
 */
router.put('/:id', (req, res) => {
  Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      image: req.body.image,
    },
    { new: true }
  )
    .then((category) => {
      if (!category) {
        return res.status(400).send('The category cannot be updated!');
      }
      res.status(201).send(category);
    })
    .catch((error) => {
      // Handle any error that occurred during the update process
      console.error(error);
      res.status(500).send('An error occurred while updating the category.');
    });
});

/**
 * DELETE = http://localhost:3000/api/v1/categories/:id
 */
router.delete('/:id', (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: 'The category is deleted!',
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
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

module.exports = router;
