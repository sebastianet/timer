
// This APP generates a HTML page every Timeout.
//
// Test it using 
//    curl http://127.0.0.1:3001
//    curl http://127.0.0.1:3001/ping
//    curl http://127.0.0.1:3001/pagina.html
//    http://192.168.1.123:3001/pagina.html
//
// URLs :
//
// https://github.com/sebastianet/wCDT/blob/master/my_server.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//
// Versions list :
//
// 1.1.a - start code
//

var myVersio     = "v1.1.a" ;

// var http    = require ( 'http' ) ;
var express = require( 'express' ) ;
var app     = express() ;

var mData = [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ] ; // lets have 10 elements

// set some values in global var APP

app.set( 'cfgPort', process.env.PORT || 3001 ) ;
app.set( 'cfgLapse', 1900 ) ;


// set where do we server HTML pages from

    app.use( '/', express.static(__dirname + '/public') ) ; // serve whatever is in the "public" folder at the URL <root>/:filename


// implement own functions

function genTimeStamp ( arg ) {

    var currentdate = new Date();
    var szOut = "Now is: " + currentdate.getDate() + "/"
                           + (currentdate.getMonth()+1)  + "/"
                           + currentdate.getFullYear() + " @ "
                           + currentdate.getHours() + ":"
                           + currentdate.getMinutes() + ":"
                           + currentdate.getSeconds() ;

    console.log( 'gen a TimeStamp {' + szOut + '}' ) ;
    return szOut ;

} ; // genTimeStamp()

function myTimeoutFunction( arg ) {

    var szNow = genTimeStamp() ;
    console.log( "+++ got TIMEOUT. Stamp {" + szNow + '}' ) ;

// remove item at end
    var last = mData.pop() ; // remove from the end

// add an item at head
    var newLength = mData.unshift( szNow ) ; // add to the front

} ; // myTimeoutFunction


// set a repetitive timeout
setInterval( myTimeoutFunction, app.get( 'cfgLapse' ) ) ; 

// implement branches answering the client

// (1) if customers asks for a "ping", we send actual date and a link back to main page :

app.get( '/ping', function ( req, res ) {

    var texte = "<hr> Hello from Odin, " + myVersio ;
    var myTS = genTimeStamp() ;
    texte += "<p>(" + myTS + ")<p> <hr>" ;

    console.log( "got GET. send" + texte ) ;

    res.writeHead( 200, { 'Content-Type': 'text/html' } ) ; // write HTTP headers 
    res.write( texte ) ;
    res.end( ) ;

} ) ; // get '/ping'

app.get( '/', function (req, res) {
//    res.send( 'Hello World from ROOT !' ) ;
    var szNew = '<hr>' ;
    var szOne = '' ;
    console.log( '+++ got SLASH' ) ;
    mData.forEach( function( item, index, array ) {
        console.log( item, index ) ;
        szOne = '<p>' + index + ' | ' + item + '</p>' ;
        szNew = szNew + szOne ;
    });
    res.send( szNew + '<hr>' ) ;
}) ; // get "/"


// start server

var listener = app.listen( app.get( 'cfgPort' ), function () {
    console.log( '(in) app listening on port', listener.address().port )
})

console.log( '(out) APP listening at port', app.get( 'cfgPort' ) ) ;

