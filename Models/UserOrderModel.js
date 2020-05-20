const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    books: [
        {
            bookId: {
                type: Schema.Types.ObjectId,
                ref: 'BookDetail'
            },
            quantity: {
                type: Number,
                required: true,
                min: [1,'Quantity cannot be less than 1']
            }
        }
    ],

    caddress: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },

});

const OrderModel = mongoose.model('UserOrder', OrderSchema);

module.exports = OrderModel;