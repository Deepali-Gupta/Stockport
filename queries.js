var pgp = require('pg-promise')(/*options*/);
var connectionString = 'postgres://postgres:admin@localhost:5432/puppies';
// "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase"
var db = pgp(connectionString);

// add query functions
function getAllPuppies(req, res, next) {
  db.any('select * from pups')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL puppies'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function createStock(req, res, next) {
  db.none('insert into stock(stockname, industry)' +
    'values(${stockname}, ${industry})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one stock'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createStock(req, res, next) {
  req.body.market_cap = parseFloat(req.body.market_cap);
  req.body.eps = parseFloat(req.body.eps);
  db.none('insert into stock(stockname, industry, market_cap, eps)' +
    'values(${stockname}, ${industry}, ${market_cap}, ${eps})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one stock'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createHist(req, res, next) {
  req.body.open = parseFloat(req.body.open);
  req.body.high = parseFloat(req.body.high);
  req.body.low = parseFloat(req.body.low);
  req.body.close = parseFloat(req.body.close);
  req.body.adj_close = parseFloat(req.body.adj_close);
  req.body.volume = parseInt(req.body.volume);
  req.body.day = Date(req.body.day);
  db.none('insert into stock(stockid, day, open, high, low, close, adj_close, volume)' +
    'values((select stockid from stock where stockname = ${stockname}), ${day}, ${open}, ${high}, ${low}, ${close}, ${adj_close}, ${volume})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one historical entry'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createLog(req, res, next) {
  req.body.trans_qty = parseInt(req.body.trans_qty);
  req.body.trans_date = Date(req.body.trans_date);
  db.none('insert into log(userid, stockid, trans_qty, trans_date)' +
    'values((select userid from user where username = ${username}), (select stockid from stock where stockname = ${stockname}), ${trans_qty}, ${trans_date})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one user transaction'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createPort(req, res, next) {
  req.body.qty = parseInt(req.body.qty);
  req.body.profit = parseFloat(req.body.profit);
  db.none('insert into portfolio(userid, stockid, qty, profit)' +
    'values((select userid from user where username = ${username}), (select stockid from stock where stockname = ${stockname}), ${qty}, ${profit})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one user portfolio entry'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createPuppy(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into pups(name, breed, age, sex)' +
    'values(${name}, ${breed}, ${age}, ${sex})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one puppy'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSinglePuppy(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from pups where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE puppy'
        });
    })
    .catch(function (err) {
      return next(err);
    });

}

function updatePuppy(req, res, next) {
  db.none('update pups set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    [req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated puppy'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removePuppy(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from pups where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} puppy`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllPuppies: getAllPuppies,
  getSinglePuppy: getSinglePuppy,
  createPuppy: createPuppy,
  //   updatePuppy: updatePuppy,
  //   removePuppy: removePuppy
};