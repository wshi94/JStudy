var mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

//The User
// - each user has a username and password that they set up upon registration
// - each user can have 0 or more word lists to study from
var User = new mongoose.Schema({
  //authentication provided by Passport (probably)
  wordLists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'WordList' }]
});

//A Word
// - words can be stored in a word list
// - likely use external dictionary to search for words
// - each word contains:
//   - the word itself (in Japanese)
//   - the part of speech
//   - the definition of the word
//   - any example sentences using the word
var Word = new mongoose.Schema({
	word: {type: String, required: true},
    partOfSpeech: {type: String, required: true},
    definition: {type: String, required: true},
    exampleSentences: [String]
});

//A Word List
// - word lists contain:
//   - a user associated with the list
//   - a name given to the list
//   - an array of words comprising the list
//   - time it took to finish last test (seconds?)
//   - last achieved "score" when testing using the list
// - each word list can have 0 or more words in it
var WordList = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    listName: {type: String, required: true},
    lastTime: {type: Number},
	lastScore: {type: Number},
	words: [Word]
});

User.plugin(passportLocalMongoose);

//just the name should work, otherwise it gets kind of unwieldy
WordList.plugin(URLSlugs('listName'));

mongoose.model('User', User);
mongoose.model('Word', Word);
mongoose.model('WordList', WordList);

mongoose.connect('mongodb://localhost/jstudydb');