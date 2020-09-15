
// code to randomly generate wordsearch if you want:

function generatePuzzle(words) {
    var puzzle = wordfind.newPuzzle(words, {
    height: 15,
    width:  15,
    orientations: ['horizontal', 'vertical', 'diagonal'],
    fillBlanks: true,
    preferOverlap: true
    })
    return puzzle
};

// variable containing functions to create wordsearch
var WS = (function(){

    // build the markup for the rows and columns of the board
    function createBoard( num_cols, num_rows, id, unobtrusive ) {
        var i, j, id = ( id || 'gameboard' );
        
        var html = '<div class="split left"><div class="centered"><table id="' + id + '" class="gameboard">\n';

        for( i = 0; i < num_rows; i++) {

            // note: using "\t" and "\n" to pretty-print the output for viewing "as code"
            html += '\t<tr>\n';  
    
            for( j = 0; j < num_cols; j++ ) {
                html += '\t\t<td '
                     + ( unobtrusive ? '' : ''
                     +  ' onmouseover="WS.hover(this);" '
                     +  ' onmouseout ="WS.leave(this);" '
                     +  ' onclick    ="WS.click(this, word_placement_object);" '
                     +  ' data-x    ='+j+''
                     +  ' data-y    ='+i+''
                     +  ' style    =""'
                       )
                     +  '>'
                     +  puzzle[i][j].toUpperCase()
                     +  '</td>\n'
            }
    
            html += '\t</tr>\n';


        }
    
        html += '</table>\n<h2>Biodiversity Word Search</h2></div></div>';

        return html;
    }

    // Alternative: less obtrusive binding of handlers to all cells
    // This is an alternative to in-lining the properties at html creation, 
    // but it needs to be triggered separately after the html is added to the DOM
    function binds( id ) {
        var el = document.getElementById( id );
        var els = el.getElementsByTagName('td');
        var i;
        for ( i in els ) {
            els[ i ].onclick = function() { WS.click(this); }
            els[ i ].onmouseover = function() { WS.hover(this); }
            els[ i ].onmouseout = function() { WS.leave(this); }
        }
    }

    // customize mouseover, mouseout, and click behavior
    // 
    // Why script these instead of just using CSS hover alone? Because we want to keep track 
    // of a third-state: clicked, which when present will negate the hover change
    //
    function hover( me ) {
        if ( me.className.match( /clicked/ ) ) return;
        if ( ! me.orgClassName ) me.orgClassName = me.className; 
        me.className = 'gameboard_over';
    }
    
    function leave( me ) {
        if ( me.className.match( /clicked/ ) ) return;
        me.className = me.orgClassName;
    }
    
    // make button translucent on click and check if a word has been found
    function click( me, word_placement_object ) {
        var wsTime = performance.now()
        me.className = 'gameboard_clicked';
        var i = 0

        // For every number in the solution object (each word belongs to a number)
        for (num in word_placement_object.word_placement[0]) {
            var j = 0

            // for every letter associated with that number, find the coordinates of that letter
            for (k=0; k<(Object.keys(word_placement_object.word_placement[0][i]).length-1); k++) {
                eval('var X = word_placement_object.word_placement[0]['+i+'].let'+j+'.X')
                eval('var Y = word_placement_object.word_placement[0]['+i+'].let'+j+'.Y')

                // if the button clicked has the same coordinates
                if (me.getAttribute('data-x') == X && me.getAttribute('data-y') == Y) {
                    var l = 0
                    var m = 0

                    // for every letter in the same word as that letter
                    for (k=0; k<(Object.keys(word_placement_object.word_placement[0][i]).length-1); k++) {
                        eval('var X = word_placement_object.word_placement[0]['+i+'].let'+l+'.X')
                        eval('var Y = word_placement_object.word_placement[0]['+i+'].let'+l+'.Y')
                  
                        // count if the letter has been clicked
                        if (wordsearch.rows[Y].cells[X].getAttribute('class') == 'gameboard_clicked') {
                            m++

                            // if as many buttons have been clicked as the length of the word
                            if (m == word_placement_object.word_placement[0][i].word.length) {
                                var n = 0
                                for (k=0; k<(Object.keys(word_placement_object.word_placement[0][i]).length-1); k++) {
                                    eval('var X = word_placement_object.word_placement[0]['+i+'].let'+n+'.X')
                                    eval('var Y = word_placement_object.word_placement[0]['+i+'].let'+n+'.Y')
                                    wordsearch.rows[Y].cells[X].style.backgroundColor = 'black';
                                    wordsearch.rows[Y].cells[X].style.color = 'white';
                                    n++
                                }
                            }
                        }
                        l++
                    }
                }
                j++
            }
            i++  
        }
    }

    // pick a random number of rows and columns to create
    // generate the markup for the game board
    // create and/or fill the "game" container with the markup
    function main( id, unobtrusive ){
        var cols = 15;
        var rows = 15;

        // find or create the "game" container on the DOM
        var el = document.getElementById('game');
        if ( ! el ) {

            // create an inpage anchor to jump to
            el = document.createElement('a');
            el.name = 'game_board';
            document.body.appendChild( el );

            // create the game board containing element (since we didn't find one already created)
            el = document.createElement('div');
            el.id = 'game';
            document.body.appendChild( el );

            // try again for the reference now that we've created it
            el = document.getElementById('game');
        } 

        // create and populate the container with our game board
        el.innerHTML = createBoard( rows, cols, id, unobtrusive );
        location.href = '#game_board';

        // if we didn't inline the props, we need to bind them after the HTML is added to the DOM
        if ( unobtrusive ) {
            WS.binds( id );
        }

    }

    // publicly accessible methods
    return {
        main  : main,
        hover : hover,
        leave : leave,
        click : click,
        binds : binds
    };

})();