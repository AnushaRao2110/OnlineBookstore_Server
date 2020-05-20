const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecBooksSchema = new Schema({

    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'BookDetail'
    }
});

const RecBooksModel = mongoose.model('RecommendedBooks', RecBooksSchema);

module.exports = RecBooksModel;

