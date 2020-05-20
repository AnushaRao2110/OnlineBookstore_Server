const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const AdminSchema = new mongoose.Schema({
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
        minlength:[4,'Password must be atleast 8 characters long']
    },
    saltSecret: String
});


//Generation of Salt Secret and Password Hashing

AdminSchema.pre('save', function (next) {    //this method will be executed before the new user details are saved
    bcrypt.genSalt(10, (err, salt) => {     //salt secret generation
        if (!err) {
            bcrypt.hash(this.password, salt, (err, hash) => {       //password hashing with the salt secret
                if (!err) {
                    this.password = hash;
                    this.saltSecret = salt;
                    next();

                }
            });
        }
    });
});

///Email Validation
AdminSchema.path('email').validate((val) => {
    emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(val);
}, "Invalid Email");







module.exports = mongoose.model("Admin", AdminSchema);