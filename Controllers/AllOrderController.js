const express = require('express');
const router = express.Router();

const Order = require('../Models/UserOrderModel');


router.get('/ViewAllOrders', (req, res) => {
  
    Order.find((err, docs) => {
        if (!err) {res.send(docs);}
        else {console.log("Error retreiving orders : \n"+JSON.stringify(err,undefined,2));}
    });
   
});


module.exports = router;