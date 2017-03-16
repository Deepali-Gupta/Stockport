var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../queries');


router.use(function (req, res, next) {
    if (!req.session.authenticated) {
        res.send({ status: "failure", message: "no user logged in" });
    }
    else {
        next();
    }
});

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'views', 'portfolio.html'));
});

router.get('/getnetvalue',db.getPortNetValue);
router.get('/getportstocks',db.getPortStocks);
// router.get('/getportstockdetails', db.getPortStockDetails );
router.post('/gettranshist',db.getTransHist);
module.exports = router;
