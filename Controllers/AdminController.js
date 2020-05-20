const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const Admin = require('../Models/AdminModel');

router.post('/AdminRegister', (req, res, next) => {
    var nadmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile
    });

    nadmin.save((err, docs) => {
        if (!err) {
            res.send(docs);
        }
        else
            if (err.code === 11000) {
                res.status(411).send('Email already registered');
            }

            else
                return next(err);
    });
});



router.post('/AdminLogin', (req, res, next) => {

    Admin.findOne({ email: req.body.email }, (err, docs) => {
        if (!docs) {
            return res.status(401).send("Email Id is not registered");
        }
        else if (!bcrypt.compareSync(req.body.password, docs.password)) {
            return res.status(401).send("Wrong password.Try again.");
        }
        else {

            token = jwt.sign(
                { userId: docs._id },
                'this_is_a_secret_123',
                { expiresIn: '2h' });
            res.status(200).json({ token: token });
            console.log('Login Successful');

        }
    });

});


router.get("/AdminProfile", (req, res, next) => {
    var token;
    if ('authorization' in req.headers) {
        token = req.headers['authorization'].split(' ')[1];
        console.log(token);
    }
    if (!token) {
      
        return res.status(403).send({ auth: false, message: 'No Token Provided' });

    }
    else {

        jwt.verify(token, "this_is_a_secret_123", (err, decoded) => {
            if (err)
                return res.status(500).send({ auth: false, message: 'Token Authentication' });
            else {
                req._id = decoded.userId;
                next();
            }
        })
    }
}, (req, res, next) => {
    
    Admin.findOne({_id:req._id},
    (err, user) => {
           
            if (!user){
                console.log("USER NOT FOUND");
                return res.status(400).send("Error in login");
            }
            else {
                
                return res.status(200).json({ status: true, user: _.pick(user, ['name', 'email']) });
            }
        })
});

module.exports = router;