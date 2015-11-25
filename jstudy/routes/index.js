var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var WordList = mongoose.model('WordList');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'JStudy' });
});

//search
router.get('/search', function(req, res, next){
  res.render('search');
});

//add word to list
//do this dynamically with javascript?
router.post('/search', function(req, res, next){

});

//lists created
router.get('/lists', function(req, res, next){
    //use the find query to get all lists in the db to show on the page
    WordList.find(function(err, list, count){
        console.log(list);
        res.render('lists', {'wordList': list});
    });
});

//create a new list
router.get('/lists/create', function(req, res, next){
    res.render('create');
});

//store new list created into db
router.post('/lists/create', function(req, res, next){
    //this should take the information from the form and make a new list
    var wordList = new WordList({
        listName: req.body.listName,
        //user: ,
        words: []
    });

    //save the list
    wordList.save(function(err, list){
        console.log("List saved");
        res.redirect('/lists/' + list.slug);
    });
});

//individual lists
//don't know what kind of slug to use yet
router.get('/lists/:slug', function(req, res, next){
    WordList.findOne({slug: req.params.slug}, function(err, list, count){
        res.render('makeList', {'heading': list.listName, 'list': list});
    });
});

//flashcard test for specific list
router.get('/lists/:slug/test', function(req, res, next){

});

router.post('/word/create', function(req, res, next){
    //find by slug name and then update that list with a new item
    WordList.findOneAndUpdate({slug:req.body.slug},
                          {$push: {words: {word: req.body.word, partOfSpeech: req.body.partOfSpeech, definition: req.body.definition}}},
                          function(err, list, count) {
	       //console.log(err, list, count);
           res.redirect('/lists/' + list.slug);
    }); 
});


/*
    User authentication stuff
    
           ref code
    *** doesn't work yet ***
*/
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req,res,next) {

  passport.authenticate('local', function(err,user) {
    if(user) {

      req.logIn(user, function(err) {
        res.redirect('/users/' + user.username);
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);

});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your username or password is already taken'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/users/' + req.user.username);
      });
    }
  });   
});

module.exports = router;
