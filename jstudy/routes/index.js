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
    //use the find query to get all lists belonging to the user to show on the page
    if (!!req.user){       //if we are logged in, then show the lists
        User.findOne({username: req.user.username}).populate('wordLists').exec(function(err, user){
        if (err){
            res.redirect('/lists');
        } 
        else{
            console.log(user.wordLists);
            res.render('lists', {'wordList': user.wordLists});    
        }
        });
    }
    else{
        /*
            TODO
                Make it so that it shows an error message on the lists page
        */
        res.render('lists');
    }
    
    
    /*
    WordList.find(function(err, list, count){
        console.log(list);
        res.render('lists', {'wordList': list});
    });
    */
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
        /*
            TODO
                Add words from the form
                Space separation doesn't seem to work?
        */
    });

    //save the list
    wordList.save(function(err, list){
        console.log("List saved");
        
        req.user.wordLists.push(list._id);
        req.user.save(function(err, user){
            res.redirect('/lists/' + list.slug);
        });
    });
});

//individual lists
router.get('/lists/:slug', function(req, res, next){
    WordList.findOne({slug: req.params.slug}, function(err, list, count){
        console.log(list);
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
