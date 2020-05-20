const express = require("express");
var router = express.Router();
var objectId = require('mongodb').ObjectId;
var BookModel = require("../Models/BookModel");


router.get('/books', (req, res) => {
    BookModel.find((err, docs) => {
        if (!err)
            res.send(docs);
        else
            console.log('Error' + JSON.stringify(err, undefined, 2));
    });
});



router.put('/book/:id', (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.send(`No record with given id ${req.params.id}`);
    var BookModel = {
        bname: req.body.bname,
        aname: req.body.aname,
        bdesc: req.body.bdesc,
        bprice: req.body.bprice,
        bpic: req.body.bpic
    };

    BookModel.findByIdAndUpdate(req.params.id, { $set: BookModel }, { new: true }, (err, docs) => {
        if (!err)
            res.send(docs);
        else
            console.log('Error' + JSON.stringify(err, undefined, 2));

    });

});

router.get('/book/:id', (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.send(`No record with given id ${req.params.id}`);
    BookModel.findById(req.params.id, (err, docs) => {
        if (!err)
            res.send(docs);
        else
            console.log('Error' + JSON.stringify(err, undefined, 2));
    });
});

router.delete('/book/:id', (req, res) => {
    if (!objectId.isValid(req.params.id))
        return res.send("Invalid ID");
    BookModel.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err)
            res.send(JSON.stringify(docs));
        else
            console.log('Error' + JSON.stringify(err, undefined, 2));
    });
});

router.post('/book', (req, res) => {
    var books = new BookModel({
        bname: req.body.bname,
        aname: req.body.aname,
        bdesc: req.body.bdesc,
        bprice: req.body.bprice,
        bpic: req.body.bpic
    });
    books.save((err, doc) => {
        if (!err)
            res.send(doc);
        else
            console.log('Error' + JSON.stringify(err, undefined, 2));
    });
});

module.exports = router;