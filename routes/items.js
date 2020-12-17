var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res, next) {
  res.render('pages/items/item_list', { title: 'Item list page' });
});

// router.get('/add', function(req, res, next) {
//     res.send('add video');
// });

// router.get('/edit', function(req, res, next) {
//     res.send('edit video');
// });

module.exports = router;
