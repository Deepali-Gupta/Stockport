var pgp = require('pg-promise')(/*options*/);
var connectionString = 'postgres://postgres:admin@localhost:5432/stocks';
// "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase"
var db = pgp(connectionString);

// add query functions
function getSingleStock(req, res, next) {
  db.one('select stockname, industry, close, open, high, low, volume'+
         ' from stock inner join ('+
         ' select distinct on (stockid) stockid, day, open, high, low, close, volume, adj_close'+
         ' from history order by stockid asc, day desc) t'+
         ' on stock.stockid=t.stockid where stockname = ${stockname}', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE stock'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSensexPrice(req, res, next) {
  db.one('select distinct on (stockid) stockid, close, (close-open) as diff, 100*(close-open)/open as perc'+
         ' from history where stockid = (select stockid from stock where stockname=\'Sensex\')'+
         ' order by stockid, day desc', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved sensex price'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSensexHist(req, res, next) {
  db.any('select day, open, high, low, close, volume, adj_close'+
         ' from history where stockid = (select stockid from stock where stockname=\'Sensex\')'+
         ' order by day desc', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved sensex history'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getStockHist(req, res, next) {
  db.any('select day, open, high, low, close, volume, adj_close'+
         ' from history'+
         ' where stockid = (select stockid from stock where stockname=$1)'+
         ' order by day desc',req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE stock history'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllStocks(req, res, next) {
  db.many('select stockname, industry, t.day as day, t.close as curr_price, (t.close-t.open) as diff, 100*(t.close-t.open)/t.open as perc'+
          ' from stock inner join ('+
          ' select distinct on (stockid) stockid, day, open, high, low, close, volume, adj_close'+
          ' from history order by stockid asc, day desc ) t'+
          ' on stock.stockid=t.stockid'+
          ' where stockname <> \'Sensex\' ', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL stocks'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTopStocks(req, res, next) {
  db.many('select stockname, industry, t.day as day, t.close as curr_price, (t.close-t.open) as diff, 100*(t.close-t.open)/t.open as perc'+
          ' from stock inner join ('+
          ' select distinct on (stockid) stockid, day, open, high, low, close, volume, adj_close'+
          ' from history order by stockid asc, day desc ) t'+
          ' on stock.stockid=t.stockid'+
          ' where stockname <> \'Sensex\''+
          ' order by perc desc limit 5', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved top gainers'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getLowStocks(req, res, next) {
  db.many('select stockname, industry, t.day as day, t.close as curr_price, (t.close-t.open) as diff, 100*(t.close-t.open)/t.open as perc'+
          ' from stock inner join ('+
          ' select distinct on (stockid) stockid, day, open, high, low, close, volume, adj_close'+
          ' from history order by stockid asc, day desc ) t'+
          ' on stock.stockid=t.stockid'+
          ' where stockname <> \'Sensex\''+
          ' order by perc limit 5', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved top losers'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getUserDetails(req, res, next) {
  db.one('select username, email'+
         ' from users'+
         ' where username = ${username}', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved user details'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getPortStocks(req, res, next) {
  db.many('select stockname, close, (close - open) as diff, 100*(close - open)/open as perc, qty, (qty*close - cost) as profit'+
          ' from stock inner join '+
          ' (select t2.stockid, close, open, qty, cost from portfolio inner join '+
          '(select distinct on (stockid) stockid, day, open, high, low, close, volume, adj_close'+
						' from history'+
						' order by stockid asc, day desc) t2'+
						' on portfolio.stockid = t2.stockid'+
						' where portfolio.userid = (select userid from users where username = ${username})) t1'+
            ' on stock.stockid = t1.stockid', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved portfolio stocks of one user'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getPortStockDetails(req, res, next) {
  db.one('select stockname, industry, close, (close - open) as diff, 100*(close - open)/open as perc, qty, (qty*close - cost) as profit'+
          ' from stock inner join '+
          ' (select t2.stockid, close, qty, cost from portfolio inner join '+
          '(select distinct on (stockid) stockid, day, open, high, low, close, volume, adj_close'+
						' from history'+
						' order by stockid asc, day desc) t2'+
						' on portfolio.stockid = t2.stockid'+
						' where portfolio.userid = (select userid from users where username = ${username})) t1'+
            ' on stock.stockid = t1.stockid'+
            ' where stockid = (select stockid from stock where stockname = ${stockname})', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved portfolio stock details of one user and one stock'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTransHist(req, res, next) {
  db.many('select trans_qty, trans_date, close '+
          'from log inner join history'+
          ' on log.stockid = history.stockid'+
          ' and log.trans_date = history.day'+
          ' where log.userid = (select userid from users where username = ${username})'+
          ' order by trans_date', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved transaction history of one stock for one user'
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

function createHist(req, res, next) {
  req.body.open = parseFloat(req.body.open);
  req.body.high = parseFloat(req.body.high);
  req.body.low = parseFloat(req.body.low);
  req.body.close = parseFloat(req.body.close);
  req.body.adj_close = parseFloat(req.body.adj_close);
  req.body.volume = parseInt(req.body.volume);
  req.body.day = Date(req.body.day);
  db.none('insert into stock(stockid, day, open, high, low, close, volume, adj_close)' +
    'values((select stockid from stock where stockname = ${stockname}), ${day}, ${open},'+
    ' ${high}, ${low}, ${close}, ${volume}, ${adj_close})',
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
    'values((select userid from user where username = ${username}), '+
    '(select stockid from stock where stockname = ${stockname}), ${trans_qty}, ${trans_date})',
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
  db.none('insert into portfolio(userid, stockid, qty, cost)' +
    'values((select userid from user where username = ${username}), '+
    '(select stockid from stock where stockname = ${stockname}), ${qty}, ${cost})',
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

function createUser(req, res, next) {
  db.none('insert into users(username, password, role, email)' +
    ' values(${username},${password},${role} ${email})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one user entry'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateStock(req, res, next) {
  db.none('update table stock set stockname = ${stockname1} '+
		'industry = ${industry} '+
	  'where stockname = ${stockname2}',
    [req.body])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated stock'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updatePort(req, res, next) {
  db.none('update table portfolio '+
	'set qty = qty + ${qty} '+
		'cost = cost + ${qty} * '+
		'(select close from history where stockid = '+
			'(select stockid from stock where stockname=${stockname})'+
			'and day = ${day} )'+
	' where stockid = (select stockid from stock where stockname=${stockname})'+
		' and userid = (select userid from users where username=${username})',
    [req.body])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated portfolio'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateUser(req, res, next) {
  db.none('update table users '+
	'set username = ${username2} '+
		'password = ${password} '+
		'role = ${role} '+
		'email = ${email} '+
	'where username = ${username1}',
    [req.body])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated User'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeStock(req, res, next) {
  db.result('delete from stock where stockname = ${stockname}', req.body)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} Stock`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeUser(req, res, next) {
  db.result('delete from users where username = ${username}', req.body)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} User`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

function removePortTrig(req, res, next) {
  db.result('delete from portfolio where qty = 0', req.body)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} Portfolio entry`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

function removePort(req, res, next) {
  db.result('delete from portfolio '+
'where stockid = (select stockid from stock where stockname = ${stockname})'+
' and userid = (select userid from users where username = ${username})', req.body)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} Portfolio entry`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllStocks: getAllStocks,
  getTopStocks: getTopStocks,
  getLowStocks: getLowStocks,
  getSingleStock: getSingleStock,
  getSensexPrice: getSensexPrice,
  getSensexHist: getSensexHist,
  getStockHist: getStockHist,
  getUserDetails: getUserDetails,
  getPortStocks: getPortStocks,
  getPortStockDetails: getPortStockDetails,
  getTransHist: getTransHist,
  createStock: createStock,
  createHist: createHist,
  createLog: createLog,
  createPort: createPort,
  createUser: createUser,
  updateStock: updateStock,
  updatePort: updatePort,
  updateUser: updateUser,
  removeStock: removeStock,
  removeUser: removeUser,
  removePortTrig: removePortTrig,
  removePort: removePort
};