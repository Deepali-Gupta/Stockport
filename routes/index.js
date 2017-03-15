var express = require('express');
var router = express.Router();
const path = require('path');
var db = require('../queries');
/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  // res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
  res.redirect('/home');
});

router.get('/home',function(req,res, next) {
  res.sendFile(path.join(__dirname,'..','views','homepage.html' ));

});

router.get('/register',function(req,res, next) {
  res.sendFile(path.join(__dirname,'..','views','registration.html' ));
});


router.post('/register',db.createUser);


router.get('/sensexview',function(req,res, next) {
  res.sendFile(path.join(__dirname,'..','views','sensexview.html' ));
});

router.get('/api/stockdetail/:stockname',db.getSingleStock);
router.get('/api/stockhist/:stockname',db.getStockHist);

router.get('/api/stocks', db.getAllStocks);
router.get('/api/topstocks',db.getTopStocks);
router.get('/api/lowstocks',db.getLowStocks);
router.get('/api/getsensexprice',db.getSensexPrice);
router.get('/api/getsensexhist',db.getSensexHist);


//users
router.get('/api/useroperations', function(req,res,next) {
  res.sendFile( path.join(__dirname,'..','views','useroperations.html' ));
});
router.get('/api/allusers', db.getAllUsers);
router.post('/api/removeuser', db.removeUser);
router.post('/api/updateuser',db.updateUser);

// admin hub
router.get('/admin', function(req,res,next) {
  res.sendFile( path.join(__dirname,'..','views','adminhub.html' ));
});

// router.get('/api/puppies/:id', db.getSinglePuppy);
// router.post('/api/puppies', db.createPuppy);
// router.put('/api/puppies/:id', db.updatePuppy);
// router.delete('/api/puppies/:id', db.removePuppy);

module.exports = router;
