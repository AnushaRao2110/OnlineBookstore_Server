const express = require('express');
const bodyparser = require('body-parser');
const passport = require('passport');

const cors = require('cors');
const db = require('./db');

var app = express();
app.use(cors());


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const SignUpController = require('./Controllers/SignUpController');
const BookController = require('./Controllers/BookController');
const UserOrderController = require('./Controllers/UserOrderController');
const AllOrderController = require('./Controllers/AllOrderController');
const AdminController = require('./Controllers/AdminController');
const CartController = require('./Controllers/CartController');
const RecBooksController = require('./Controllers/RecommendedBooksController');
const PaymentController=require('./Controllers/PaymentController');

//Passport Middleware

app.use(passport.initialize());

//Passport config

require('./config/passport')(passport);
app.get('/',(req,res)=>{ res.send("API is working")})
app.use('/', SignUpController);
app.use('/', BookController);
app.use('/', UserOrderController);
app.use('/', AllOrderController);
app.use('/', AdminController);
app.use('/',CartController);
app.use('/',RecBooksController);
app.use('/',PaymentController);



//to display error messages related to validation
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`listening at port ${process.env.PORT || 3000} `);
});