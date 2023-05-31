const { Order } = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

/**
 * GET = http://localhost:3000/api/v1/orders
 */
router.get('/', (req, res) => {
  Order.find()
    .populate('user', 'name')
    .sort({ dateOrdered: -1 })
    .then((orderList) => {
      if (orderList) {
        return res.status(200).send(orderList);
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
  Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    })
    .then((order) => {
      if (order) {
        return res.status(200).send(order);
      } else {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
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
 * POST = http://localhost:3000/api/v1/orders
 */
router.post('/', (req, res) => {
  Promise.all(
    req.body.orderItems.map((orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      return newOrderItem.save().then((savedOrderItem) => savedOrderItem._id);
    })
  )
    .then((orderItemsIdsResolved) => {
      Promise.all(
        orderItemsIdsResolved.map((orderItemId) => {
          return OrderItem.findById(orderItemId)
            .populate('product', 'price')
            .then((orderItem) => {
              const totalPrice = orderItem.product.price * orderItem.quantity;
              return totalPrice;
            });
        })
      )
        .then((totalPrices) => {
          const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
          let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
          });
          order
            .save()
            .then((savedOrder) => {
              if (!savedOrder)
                return res.status(400).send('the order cannot be created!');
              res.send(savedOrder);
            })
            .catch((error) => {
              res.status(500).send('An error occurred while saving the order.');
            });
        })
        .catch((error) => {
          res
            .status(500)
            .send('An error occurred while calculating total prices.');
        });
    })
    .catch((error) => {
      res.status(500).send('An error occurred while saving order items.');
    });
});

/**
 * PUT = http://localhost:3000/api/v1/orders
 */
router.put('/:id', (req, res) => {
  Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )
    .then((order) => {
      if (!order) {
        res.status(400).send('The order cannot be updated!');
      } else {
        res.send(order);
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err });
    });
});

/**
 * DELETE = http://localhost:3000/api/v1/orders/:id
 */
router.delete('/:id', (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then((order) => {
      if (order) {
        const orderItemPromises = order.orderItems.map((orderItem) => {
          return OrderItem.findByIdAndRemove(orderItem);
        });

        Promise.all(orderItemPromises)
          .then(() => {
            res.status(200).json({
              success: true,
              message: 'The order is deleted!',
            });
          })
          .catch((err) => {
            res.status(500).json({ success: false, error: err });
          });
      } else {
        res.status(404).json({
          success: false,
          message: 'Order not found!',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err });
    });
});

/**
 * GET = http://localhost:3000/api/v1/orders/get/totalsales
 */
router.get('/get/totalsales', (req, res) => {
  Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
  ])
    .then((totalSales) => {
      if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated');
      }

      res.send({ totalsales: totalSales.pop().totalsales });
    })
    .catch((error) => {
      // Handle error here
      res.status(500).send('An error occurred while fetching total sales');
    });
});

/**
 * GET = http://localhost:3000/api/v1/orders/get/count
 */
router.get('/get/count', async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();

    if (orderCount === 0) {
      return res.status(500).json({ success: false });
    }

    res.status(200).json({
      orderCount: orderCount,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET = http://localhost:3000/api/v1/orders/get/userorders/:userid
 */
router.get('/get/userorders/:userid', (req, res) => {
  Order.find({ user: req.params.userid })
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        populate: 'category',
      },
    })
    .sort({ dateOrdered: -1 })
    .then((userOrderList) => {
      if (!userOrderList) {
        res.status(500).json({ success: false });
      }
      res.send(userOrderList);
    })
    .catch((error) => {
      // Handle error here
      res.status(500).json({
        success: false,
        error: 'An error occurred while fetching user orders',
      });
    });
});

module.exports = router;
