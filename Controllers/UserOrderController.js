const express = require('express');
const router = express.Router();
var objectId = require('mongodb').ObjectId;
const passport = require('passport');

const UserOrder = require('../Models/UserOrderModel');

router.post('/AddOrder', passport.authenticate('jwt', { session: false }), (req, res) => {
    var newOrder = new UserOrder({
        user: req.user.id,
        books: req.body.books,
        caddress: req.body.caddress,
        date: req.body.date
    });

    newOrder.save()
        .then(order => {
            res.json({
                success: 'Order Successful',
                order: order
            });
        })
        .catch(err => {
            return res.status(400).json(err);
        })

});


router.get('/getOrders', passport.authenticate('jwt', { session: false }), (req, res) => {

    UserOrder.find({ user: req.user.id }).populate('user', ['name', 'email']).populate('books.bookId')//fetches all the fields of object or only those that are specied in []
        .then((orders) => {
            res.json(orders);
        })
        .catch(err => {
            res.status(404).json({ message: "Error in fetching orders" });
        })
});

router.delete('/deleteOrders/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.send("Invalid ID");
    Order.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err)
            res.send(JSON.stringify(docs));
        else
            res.status(404).json({ Error: "Error in deleting orders" });
    });
});


module.exports = router;