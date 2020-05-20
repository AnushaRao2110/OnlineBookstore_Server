const express = require('express');
const passport = require('passport');
const router = express.Router();
var objectId = require('mongodb').ObjectId;
var RecBooksModel = require('../Models/RecommendedBooksModel');

router.post('/addRecBooks', passport.authenticate('jwt', { session: false }), (req, res) => {

    if (RecBooksModel.books.filter(book => (book.bookId.toString() === req.body.bookId)).length > 0) {
        return res.status(400).json({ message: "Item already added to recommended books" });
    }
    else {
        RecBooksModel.books.unshift({ bookId: req.body.bookId });
        RecBooksModel.save()
            .then(book => {
                res.json(book)
            });
    }
});

router.get('/getRecBooks', (req, res) => {

    RecBooksModel.find().populate('bookId', ['bname', 'bprice', 'bpic'])
        .then(recBooks => {
            res.json(recBooks);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

router.delete('/deleteFromRecBooks/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    if (!objectId.isValid(req.params.id))
        return res.send("Invalid ID");

    if (RecBooksModel.books.filter(book => book.bookId.toString() === req.params.id).length === 0) {
        res.status(400).json({ message: "No item to delete" });
    }
    else {
        const removeIndex = RecBooksModel.books.map(book => book.bookId.toString()).indexOf(req.params.id);
        user.cart.splice(removeIndex, 1);

        RecBooksModel.save()
            .then(books => {
                res.json(books);
            })
            .catch(err => {
                res.status(400).json(err);
            })
    }
});

module.exports = router;