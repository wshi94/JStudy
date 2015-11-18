var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'JStudy' });
});

//search
router.get('/search', function(req, res, next){

});

//add word to list
//do this dynamically with javascript?
router.post('/search', function(req, res, next){

});

//lists created
router.get('/lists', function(req, res, next){

});

//create a new list
router.get('/lists/create', function(req, res, next){

});

//store new list created into db
router.post('/lists/create', function(req, res, next){

});

//individual lists
//don't know what kind of slug to use yet
router.get('/lists/:slug', function(req, res, next){

});

//flashcard test for specific list
router.get('/lists/:slug/test', function(req, res, next){

});


/*
Also user authentication stuff
*/

module.exports = router;
