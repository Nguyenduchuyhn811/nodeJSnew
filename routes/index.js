var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("ABC 1234");
  res.render('index', { title: 'Express 1234 Hello world' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('pages/dashboard/index', { title: 'Dashboard page' });
});

module.exports = router;
