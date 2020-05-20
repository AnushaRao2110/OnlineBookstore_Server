const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const BookSchema=new Schema({
    bookName:{
        type: String
    },
    authorName:{
        type : String
    },
    bookDesc:{
        type :String
    },
    bookPrice:{
        type : Number
    },
    bookPic:{
        type :String
    }
});

const BookModel = mongoose.model('BookDetail',BookSchema);

module.exports = BookModel;