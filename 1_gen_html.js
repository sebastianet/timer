//
// This APP generates a HTML page every Timeout.
//
// Test it using 
//
//    curl http://127.0.0.1:3001
//    curl http://127.0.0.1:3001/ping
//    curl http://127.0.0.1:3001/pagina.html
//    http://192.168.1.123:3001/pagina.html     auto-reload every 90 seconds
//
// GIT
//
//    https://github.com/sebastianet
//    git commit -am "descripcio"
//    git push -u origin master
//
// URLs :
//
//    https://github.com/sebastianet/wCDT/blob/master/my_server.js
//    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//    https://nodejs.org/api/fs.html#fs_file_system
//
// Pendent :
//
//    Posar FAVICON.ICO
//
// Versions list :
//
// 1.1.a - start code
// 1.1.b - delete old file, create new one
// 1.1.c - llegir socis.json
//

var myVersio     = "v1.1.c" ;

// var http    = require ( 'http' ) ;
var express = require( 'express' ) ;
var app     = express() ;
const fs    = require( 'fs' ) ; // manage filesystem

var mData = [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',   
              ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
              ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ] ;  // lets have 30 elements

// set some values in global var APP

app.set( 'cfgPort', process.env.PORT || 3001 ) ;
app.set( 'cfgLapse', 5900 ) ;


// set where do we server HTML pages from

    app.use( '/', express.static(__dirname + '/public') ) ; // serve whatever is in the "public" folder at the URL <root>/:filename


// implement few own functions

// Date() prototypes - use as 
// var szOut = (new Date).yyyymmdd() + '-' + (new Date).hhmmss() + ' ' + szIn + '<br>' ;

Date.prototype.yyyymmdd = function ( ) { 

     var yyyy = this.getFullYear().toString();                                    
     var mm   = (this.getMonth()+1).toString(); // getMonth() is zero-based         
     var dd   = this.getDate().toString();
     return yyyy + '/' + (mm[1]?mm:'0'+mm[0]) + '/' + (dd[1]?dd:'0'+dd[0]);

}; // yyyymmdd()

Date.prototype.hhmmss = function () {

     function fixTime(i) {
          return (i < 10) ? "0" + i : i;
     }
     var today = new Date(),
          hh = fixTime( today.getHours() ),
          mm = fixTime( today.getMinutes() ),
          ss = fixTime( today.getSeconds() ) ;
     var myHHMMSS = hh + ':' + mm + ':' + ss ;
     return myHHMMSS ;

} ; // hhmmss()

function genTimeStamp ( arg ) {

    var szOut = (new Date).yyyymmdd() + '-' + (new Date).hhmmss() + ' ' ;
//    console.log( 'gen a TimeStamp {' + szOut + '}' ) ;
    return szOut ;

} ; // genTimeStamp()


// lets implement what to do when the TIMEOUT lapse expires

function myTimeoutFunction( arg ) {

// (a) update "mData" structure with some new data, as timestamp or song name

    var szNow = genTimeStamp() ;
    console.log( "+++ got TIMEOUT. Stamp {" + szNow + '}' ) ;

// remove item at end
    var last = mData.pop() ; // remove from the end

// add an item at head
    var newLength = mData.unshift( szNow ) ; // add to the front

// (b) generate new page "/public/pagina.html" so client gets fresh data

//   (b1) delete the file we shall create, "pagina.nova"
//   (b2) create "pagina.nova"
//   (b3) delete old "pagina.html"
//   (b4) rename "pagina.nova" as "pagina.html

// (b1) 

    var newFN = './public/pagina.nova' ;
    console.log( '(b1) delete ' + newFN ) ;

    fs.unlink( newFN, (err) => {
        if (err) {
            if ( err.code === 'ENOENT' ) {
                console.error( '--- (b1) file '+ newFN +' does not exist' ) ;
            } else {
                throw err ; // fatal error : stop
            } ;
        } else {
            console.log( '+++ (b1) successfully deleted ' + newFN ) ;
        } ;

// (b2)

        var newFN = './public/pagina.nova' ;
        console.log( '(b2) create ' + newFN ) ;

        var S1 = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/html40/loose.dtd">\n' ;
        S1 += '<HTML> <HEAD>\n' ;
        S1 += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8">\n' ;
        S1 += '<META HTTP-EQUIV="Refresh" CONTENT="30;URL=./pagina.html">\n' ;
        S1 += '<LINK REL=STYLESHEET HREF="pagina.css" TYPE="text/css">\n' ;
        S1 += '<TITLE>' + 'Its ' + (new Date).hhmmss() + '</TITLE>\n' ;
        S1 += '</HEAD>\n <BODY>\n' ;

        var S2 = '<hr>\n' ;
        mData.forEach( function( item, index, array ) {
            S2 += '<p>' + index + ' | ' + item + '</p>\n' ;
        } ) ; // forEach element of mData

        var S3 = '<hr>\n </BODY>\n </HTML>\n' ;

        fs.writeFile( newFN, S1+S2+S3, (err) => {
            if (err) throw err;
            console.log( '+++ (b2) file ' + newFN + ' has been saved!' ) ;

// (b3)
            var oldFN = './public/pagina.html' ;
            console.log( '(b3) delete ' + oldFN ) ;
            fs.unlink( oldFN, (err) => {
                if (err) {
                    if ( err.code === 'ENOENT' ) {
                        console.error( '--- (b3) file ' + oldFN + ' does not exist' ) ;
                    } else {
                        throw err ; // fatal error : stop
                    } ;
                } else {
                    console.log( '+++ (b3) successfully deleted ' + oldFN ) ;
                } ;

// (b4)
                var newFN = './public/pagina.html' ;
                var oldFN = './public/pagina.nova' ;
                console.log( '(b4) rename ' + oldFN + ' as ' + newFN ) ;

                fs.rename( oldFN, newFN, (err) => {
                    if (err) throw err;
                    console.log( '+++ (b4) renamed complete ' + newFN ) ;
                });

            } ) ; // synch delete "pagina.html"

        } ) ; // write "pagina.nova"

    } ) ; // synch delete "pagina.nova"

} ; // myTimeoutFunction()

// llegir les dades dels socis

socis.json

// set a repetitive timeout
setInterval( myTimeoutFunction, app.get( 'cfgLapse' ) ) ; // lets call own function every defined lapse


// implement branches answering the client requests

// (1) if customer asks for a "ping", we send actual date and a link back to main page

app.get( '/ping', function ( req, res ) {

    var texte = "<hr> Hello from Odin, " + myVersio ;
    var myTS = genTimeStamp() ;
    texte += "<p>(" + myTS + ")<p> <hr>" ;

    console.log( "got GET. send" + texte ) ;

    res.writeHead( 200, { 'Content-Type': 'text/html' } ) ; // write HTTP headers 
    res.write( texte ) ;
    res.end( ) ;

} ) ; // get '/ping'

// (2) if customer asks for "root" page, we display the item list

app.get( '/', function (req, res) {
//    res.send( 'Hello World from ROOT !' ) ;
    var szNew = '<hr>' ;
    var szOne = '' ;
    console.log( '+++ got SLASH' ) ;
    mData.forEach( function( item, index, array ) {
        console.log( item, index ) ;
        szOne = '<p>' + index + ' | ' + item + '</p>' ;
        szNew = szNew + szOne ;
    } ) ; // forEach element of mData
    res.send( szNew + '<hr>' ) ;
}) ; // get "/"


// start server

var listener = app.listen( app.get( 'cfgPort' ), function () {
    console.log( '(in) app listening on port', listener.address().port )
})

console.log( '(out) APP listening at port', app.get( 'cfgPort' ) ) ;

