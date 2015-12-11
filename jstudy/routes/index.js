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

//lists created
router.get('/lists', function(req, res, next){
    //use the find query to get all lists belonging to the user to show on the page
    if (!!req.user){       //if we are logged in, then show the lists
        User.findOne({username: req.user.username}).populate('wordLists').exec(function(err, user){
        if (err){
            res.redirect('lists');
        } 
        else{
            res.render('lists', {'wordList': user.wordLists});    
        }
        });
    }
    else{                  //if we are not logged in, then prompt the user to login
        res.redirect('login', {message: 'Please login to access your lists.'});
    }
});

//api to get the lists of the user
router.get('/api/lists', function(req, res) {
  if (!!req.user){       //if we are logged in, then show the lists
        User.findOne({username: req.user.username}).populate('wordLists').exec(function(err, user){
        if (err){   //return no-lists
            res.json({error: 'no-lists'});
        } 
        else{
            //only return the list name since that's all we need
            res.json(user.wordLists.map(function(ele){
                return {
                    'listName': ele.listName
                };
            }));
        }
        });
    }
    else{   //otherwise, return no-user error
        res.json({error: 'no-user'});
    }
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
        user: req.user._id,
        words: []
    });

    //save the list
    wordList.save(function(err, list){
        req.user.wordLists.push(list._id);
        req.user.save(function(err, user){
            res.redirect('/lists/' + list.slug);
        });
    });
});

//individual lists
router.get('/lists/:slug', function(req, res, next){

    if (!!req.user) {       //if we are logged in, then show the lists
        User.findOne({ username: req.user.username }).populate('wordLists').exec(function (err, user) {
            if (err) {
                res.redirect('login');
            }
            else {
                WordList.findOne({ slug: req.params.slug }, function (err, list, count) {
                    if (err){
                        console.log(err);
                        console.log("this error");
                        res.redirect('login');
                    }
                    else{
                        console.log(list);
                        res.render('makeList', { 'heading': list.listName, 'list': list });
                    }
                });
            }
        });
    }
    else {
        res.redirect('login', {message: 'Please login to access your lists.'});
    }
});

//post request to add a new word to a list
router.post('/word/create', function(req, res, next){
    //find by slug name and then update that list with a new item
    //slug name is whatever radio option was checked on the search page
    WordList.findOneAndUpdate({listName:req.body.radioOption},
                          {$push: {words: {word: req.body.word, partOfSpeech: req.body.partOfSpeech, definition: req.body.definition}}},
                          function(err, list) {
           if (err){
               console.log('an error occurred');
           }
           else{
               res.redirect('/lists/' + list.slug);
           }
    }); 
});



/*
    Authentication routes
*/

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req,res,next) {
    //try to authenticate the user logging in using local strategy
    passport.authenticate('local', function(error, user){
        if (user){
            req.logIn(user,function(error){
                res.redirect('/');  //if successful, redirect to homepage
            });
        }
        else{
            res.render('login', {message: 'Sorry, your username or password is incorrect.'});
        }
    })(req, res, next);
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
    //register a new user with given username and password from form
    User.register(new User({username:req.body.username}), req.body.password, function(error, user){
       if (error){
           res.render('register', {message: 'Sorry, your registration information is not valid.'});
       } 
       else{
           passport.authenticate('local')(req, res, function(){
               res.redirect('/');       //redirect to homepage after registering
           });
       }
    }); 
});

module.exports = router;
