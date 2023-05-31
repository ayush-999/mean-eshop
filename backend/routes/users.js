const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * GET = http://localhost:3000/api/v1/users
 */
router.get('/', (req, res) => {
  User.find()
    // .select('-passwordHash')
    .then((userList) => {
      if (userList) {
        return res.status(200).send(userList);
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
 * GET = http://localhost:3000/api/v1/users/:id
 */
router.get('/:id', (req, res) => {
  User.findById(req.params.id)
    .select('-passwordHash')
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      } else {
        return res.status(404).json({
          success: false,
          message: 'User not found',
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
 * POST = http://localhost:3000/api/v1/users
 */
router.post('/', (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user
    .save()
    .then((user) => {
      if (!user) {
        return res.status(404).send('The user cannot be created!');
      }
      res.status(201).send(user);
    })
    .catch((error) => {
      // Handle any error that occurred during the save process
      console.error(error);
      res.status(500).send('An error occurred while creating the user.');
    });
});

/**
 * PUT = http://localhost:3000/api/v1/users/:id
 */
router.put('/:id', (req, res) => {
  User.findById(req.params.id)
    .then(async (userExist) => {
      let newPassword;
      if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
      } else {
        newPassword = userExist.passwordHash;
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          email: req.body.email,
          passwordHash: newPassword,
          phone: req.body.phone,
          isAdmin: req.body.isAdmin,
          street: req.body.street,
          apartment: req.body.apartment,
          zip: req.body.zip,
          city: req.body.city,
          country: req.body.country,
        },
        { new: true }
      );

      if (!user) {
        return res.status(400).send('The user cannot be updated!');
      }
      res.status(201).send(user);
    })
    .catch((error) => {
      res.status(500).send('An error occurred while updating the user.');
    });
});

/**
 * DELETE = http://localhost:3000/api/v1/users/:id
 */
router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: 'The user is deleted!',
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'user not found',
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
 * PUT = http://localhost:3000/api/v1/users/login
 */
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      const secret = process.env.secret;
      if (!user) {
        return res.status(400).send('The user not found');
      }
      if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
          {
            userId: user.id,
            isAdmin: user.isAdmin,
          },
          secret,
          {
            expiresIn: '1d',
          }
        );
        res.status(200).send({
          user: user.email,
          token: token,
        });
      } else {
        return res.status(400).send('Password is wrong!');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('An error occurred');
    });
});

/**
 * GET = http://localhost:3000/api/v1/users/get/count
 */
router.get('/get/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json({
      userCount: userCount,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
