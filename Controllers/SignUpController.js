const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');
const _ = require('lodash');

const User = require('../Models/UserModel');

router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            //Check if user already registered
            if (user) {
                return res.status(400).json({ message: "Email is already registered" });
            }

            else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    mobile: req.body.mobile,
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        newUser.password = hash;
                        newUser.save()
                            .then((user) =>
                                res.json({ user: user })
                            )
                            .catch((err) => {
                                console.log(err);
                            })
                    });

                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({ error: err });

        })
});



router.post('/login', (req, res) => {

    User.findOne({ email: req.body.email })
        .then((user) => {
            //Check if user exists
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            bcrypt.compare(req.body.password, user.password)
                //Check if password entered matches with hashed password
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({ message: "Incorrect password" });
                    }
                    else {
                        const payload = { id: user._id };
                        let token = jwt.sign(payload, keys.secretKey, { expiresIn: '3h' });
                        res.status(200).json({
                            sucess: 'Login successful',
                            token: 'Bearer ' + token
                        });
                    }
                })
                .catch(err => {
                    return res.status(400).json({ error: err });
                })
        })
        .catch(err => {
            console.log(err);
        })
});


router.get("/userProfile", passport.authenticate('jwt', { session: false }), (req, res) => {

    User.findById(req.user.id, (err, user) => {

        if (!user) {
            return res.status(400).json({ 'Error': 'Unable to fetch user profile' });
        }
        else {

            return res.status(200).json({ status: true, user: _.pick(user, ['name', 'email', 'mobile']) });
        }
    })
});

module.exports = router;


