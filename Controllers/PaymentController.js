const express = require('express');
const router = express.Router();
const passport = require('passport');
const keys = require('../config/keys');
const Insta = require('instamojo-nodejs');
const url = require('url');

router.post('/payAmount', passport.authenticate('jwt', { session: false }), (req, res) => {

    Insta.setKeys(keys.API_KEY, keys.AUTH_KEY);
    const data = new Insta.PaymentData();
    Insta.isSandboxMode(true);

    data.purpose = req.body.purpose; // REQUIRED
    data.amount = req.body.amount;   // REQUIRED
    data.currency = 'INR';
    data.buyer_name = req.body.name;
    data.email = req.body.email;
    data.phone = req.body.phone;
    data.send_email = 'True';
    data.allow_repeated_payments = 'False';
    data.redirect_url = req.body.redirect_url

    Insta.createPayment(data, (err, docs) => {
        if (err) {
            return res.status(400).json({ Error: err });
        }
        else {
            const responseData = JSON.parse(docs);
            const longUrl = responseData.payment_request.longurl;
            res.json(longUrl);
        }
    })
})

router.get('/pay/redirect', (req, res) => {

    let url_parts = url.parse(req.url, true);
    responseData = url_parts.query;
    if (responseData.payment_id) {
        return res.redirect('http://localhost:4200/');
    }
});

module.exports = router;