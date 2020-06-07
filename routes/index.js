var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(['/', '/mousetracker'], function(req, res, next) {
  res.render('index', { title: 'Realtime Cursor Tracking' });
});

module.exports = router;
