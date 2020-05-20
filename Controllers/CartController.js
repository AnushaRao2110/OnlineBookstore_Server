const express = require('express');
const passport = require('passport');
const router = express.Router();
var objectId = require('mongodb').ObjectId;
var BookModel = require('../Models/BookModel');
var UserModel = require('../Models/UserModel');

router.post('/addToCart', passport.authenticate('jwt', { session: false }), (req, res) => {

    UserModel.findOne({ _id: req.user.id })
        .then(user => {
            //check if item with that id already present in cart array
            //converting id to string since it is of type ObjectId
            if (user.cart.filter(cartItem => (cartItem.bookId.toString() === req.body.bookId)).length > 0) {
                return res.status(400).json({ message: "Item already added to cart" });
            }
            else {
                user.cart.unshift({ bookId: req.body.bookId });
                user.save()
                    .then(book => {
                        res.json(book)
                    });
            }

        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.get('/getCart', passport.authenticate('jwt', { session: false }), (req, res) => {

    UserModel.findOne({ _id: req.user.id }).populate('cart.bookId')
        .then(user => {
            res.json(user.cart);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.delete('/deleteFromCart/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    if (!objectId.isValid(req.params.id))
        return res.send("Invalid ID");

    UserModel.findById(req.user.id)
        .then(user => {

            if (user.cart.filter(cartItem => cartItem.bookId.toString() === req.params.id).length === 0) {
                res.status(400).json({ message: "No item to delete from cart" });
            }
            else {
                //finding index of the bookId to be removed from cart
                const removeIndex = user.cart.map(cartItem => cartItem.bookId.toString()).indexOf(req.params.id);
                //array.splice(index,no of elements to be removed)
                user.cart.splice(removeIndex, 1);
                user.save()
                    .then(user => {
                        res.json(user.cart);
                    })
                    .catch(err => {
                        res.status(400).json(err);
                    })
            }
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

module.exports = router;