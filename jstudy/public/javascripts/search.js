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
            var messages = JSON.parse(req.responseText);
            console.log(messages.data);
            /*
            for (var key in messages){
                if (messages.hasOwnProperty(key)){
                    document.body.appendChild(document.createElement('div')).textContent = key.message;
                }
            }*/
            
            /*
            Clickable WORD on the left (container)
                var searchQuery = document.getElementById('button1');
                searchQuery.addEventListener('click', evaluateSearch);
            Can do above to begin process of adding stuff to list
            
            
            Definition on the right
            
            */
            
            messages.data.forEach(function(obj) {
                obj.japanese.forEach(function(jap){
                    document.body.appendChild(
				    document.createElement('div')).
				    textContent = jap.reading;
                });
			     
		    });
        }
    });
    req.addEventListener('error', function(e) {
	   document.body.appendChild(document.createTextNode('uh-oh, something went wrong ' + e));
    });
    
    req.send();
}