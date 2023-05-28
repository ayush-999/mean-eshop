const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

/**
 * GET = http://localhost:3000/api/v1/categories
 */
// router.get('/', async (req, res) => {
//   const categoryList = await Category.find();

//   if (!categoryList) {
//     res.status(500).json({ success: false });
//   }
//   res.status(200).send(categoryList);
// });
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
// router.get('/:id', async (req, res) => {
//   const category = await Category.findById(req.params.id);
//   if (!category) {
//     res.status(404).json({ success: false, message: 'Category not found' });
//   }
//   res.status(200).send(category);
// });
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
// router.post('/', async (req, res) => {
//   try {
//     let category = new Category({
//       name: req.body.name,
//       icon: req.body.icon,
//       color: req.body.color,
//       image: req.body.image,
//     });
//     category = await category.save();
//     if (!category) {
//       return res.status(404).send('The category cannot be created!');
//     }
//     res.status(201).send(category);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while creating the category.');
//   }
// });
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
//----------- Normal method
// router.put('/:id', async (req, res) => {
//   const category = await Category.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       icon: req.body.icon,
//       color: req.body.color,
//       image: req.body.image,
//     },
//     { new: true }
//   );
//   if (!category) {
//     return res.status(400).send('The category cannot be updated!');
//   }
//   res.status(201).send(category);
// });
//----------- try catch method
// router.put('/:id', async (req, res) => {
//   try {
//     const category = await Category.findByIdAndUpdate(
//       req.params.id,
//       {
//         name: req.body.name,
//         icon: req.body.icon,
//         color: req.body.color,
//         image: req.body.image,
//       },
//       { new: true }
//     );
//     if (!category) {
//       return res.status(400).send('The category cannot be updated!');
//     }
//     res.status(201).send(category);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while updating the category.');
//   }
// });

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
