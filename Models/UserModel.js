const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: "Name is required ."

    },
    email: {
        type: String,
        required: "Email Id is required .",
        index: { unique: true }

    },
    password: {
        type: String,
        required: "Password is required .",
        minlength: [8, 'Password must be atleast 8 characters long']
    },
    mobile: {
        type: Number,
        required: "Mobile No. is required"
    },
    saltSecret: { type: String },

    cart: [
        {
            bookId: {
                type: Schema.Types.ObjectId,
                ref: 'BookDetail'
            },
            quantity: {
                type: Number,
                required: true,
                default : 1,
                min : [1,'Quantity cannot be less tha 1']
        }
    }
    ]
});


///Email Validation
UserSchema.path('email').validate((val) => {
    emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(val);
}, "Invalid Email");


module.exports = mongoose.model("User", UserSchema);