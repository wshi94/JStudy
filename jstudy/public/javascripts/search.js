document.addEventListener('DOMContentLoaded', search);

function search(){
    var searchQuery = document.getElementById('button1');
    searchQuery.addEventListener('click', evaluateSearch);
}

function evaluateSearch(){
    var searchTerm = document.getElementById("searchTerm").value;
    
    var url = 'http://localhost:3000/proxy/' + searchTerm;
    //http://jisho.org/api/v1/search/words?keyword= + searchTerm
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    
    var game = document.getElementById("1");

    //wipe the game clean
    while (game.firstChild){
        game.removeChild(game.firstChild);
    }
    
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            var searchResults = JSON.parse(req.responseText);
            //console.log(searchResults.data);
            
            displaySearchResults(searchResults);
        }
    });
    
    req.addEventListener('error', function(e) {
	   document.body.appendChild(document.createTextNode('uh-oh, something went wrong ' + e));
    });
    
    req.send();
}

function displaySearchResults(searchResults){
    var topResults = [];    //the top five is_common words
    
            /*
            for (var key in messages){
                if (messages.hasOwnProperty(key)){
                    document.body.appendChild(document.createElement('div')).textContent = key.message;
                }
            }*/
    
    var counter = 0;
    //we only want the, at most, top five common search results
    searchResults.data.forEach(function(entry){
        if (counter < 5){
            if (entry.is_common){
                topResults.push(entry);
                counter++;
            }
        }
    });
    
    console.log(topResults);
    
    topResults.forEach(function(obj) {
        //create the row for the current word
        var row = document.createElement('div');
        row.className = 'row';
        row.id = '';
            
        //create the container that will hold the word
        var word = document.createElement('div');
        word.className = 'col-xs-2 col-md-1.5';
        //some words don't have kanji, so just use the readings instead
        if (obj.japanese[0].word) {
            word.textContent = obj.japanese[0].word;
        }
        else {
            word.textContent = obj.japanese[0].reading;
        }
        word.style.fontSize = '3em';
        word.style.textAlign = 'center';
            
        //create the container that will hold the definition and part of speech
        var dictEntry = document.createElement('div');
        dictEntry.className = 'col-xs-16 col-md-10.5';
            
        //create the separate divs in the dictionary entry
        var partOfSpeech = document.createElement('div');
        var definition = document.createElement('div');
            
        //append these separate divs to the dictionary entry
        dictEntry.appendChild(partOfSpeech);
        dictEntry.appendChild(document.createElement('br'));
        dictEntry.appendChild(definition);
            
        //console.log(obj.senses[0].english_definitions);
            
        //get every part of speech
        for (var i = 0; i < obj.senses[0].parts_of_speech.length; i++) {

            partOfSpeech.textContent += obj.senses[0].parts_of_speech[i];
                
            //if there's more parts of speech, add a comma; otherwise add a period
            if (i + 1 < obj.senses[0].parts_of_speech.length) {
                partOfSpeech.textContent += ', ';
            }
            else if (i + 1 === obj.senses[0].parts_of_speech.length) {
                partOfSpeech.textContent += '.';
            }
        }
            
        //dictEntry.appendChild(document.createElement('br'));
            
        //get every english definition
        for (var j = 0; j < obj.senses[0].english_definitions.length; j++) {

            definition.textContent += obj.senses[0].english_definitions[j];
                
            //if there's more definitions, add a semicolon; otherwise add a period
            if (j + 1 < obj.senses[0].english_definitions.length) {
                definition.textContent += '; ';
            }
            else if (j + 1 === obj.senses[0].english_definitions.length) {
                definition.textContent += '.';
            }
        }
            
        //allow the word container to be clickable so that we can add it to a list
        word.addEventListener('click', clickedWord);
            
        //add the dictionary entry to the document
        row.appendChild(word);
        row.appendChild(dictEntry);
        document.body.appendChild(row);
        document.body.appendChild(document.createElement('br'));    //linebreak for formatting	     
    });
}


    /*
            Clickable WORD on the left (container or button)
            Also, help text when hovered to say that you can add to a list by clicking
                var searchQuery = document.getElementById('button1');
                searchQuery.addEventListener('click', evaluateSearch);
            Can do above to begin process of adding stuff to list
            
            Adding can involve clicking the word, having something pop up asking which list to add it to (with a list of lists),
            then adding the word to that list.
            
            TOP 5 "is_common" words will be shown
            
            
            Definition on the right
            
    */

function clickedWord(){
    alert("clicked");
}