//
// This APP generates a HTML page every Timeout.
//
// Test it using 
//
//    curl http://127.0.0.1:3001
//    curl http://127.0.0.1:3001/ping
//    curl http://127.0.0.1:3001/pagina.html
//    http://192.168.1.123:3001/pagina.html     auto-reload every 30 seconds
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
//    .
//
// Requisits :
//
//    nodejs - comprovat amb pi@odin:~/timer $ node -v   : v5.12.0
//    python - comprovat amb pi@odin:~/timer $ python -V : Python 2.7.9
//
// Versions list :
//
// 1.1.a - start code
// 1.1.b - delete old file, create new one
// 1.1.c - llegir socis.json
// 1.1.d - fer ping() des python
// 1.1.e - favicon.ico
//

var myVersio     = "v1.1.e" ;

var express     = require( 'express' ) ;
var app         = express() ;
const fs        = require( 'fs' ) ; // manage filesystem
var PythonShell = require( 'python-shell' ) ;

var fitxer_socis = "socis.json" ;  // configuracio de socis i IPs
var iNumSocis ;                    // numero actual de socis
var dades_socis ;                  // guardem les dades 
var idxSoci = 0 ;                  // soci amb el que estem treballant ara mateix

var python_options = {
    mode: 'text',
    pythonPath: '/usr/bin/python',
    pythonOptions: ['-u'],
    scriptPath: '/home/pi/timer',
    args: ['value1', 'value2']
} ;

var mData = [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',   
              ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
              ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ] ;  // lets have 30 elements

// set some values in global var APP

app.set( 'cfgPort', process.env.PORT || 3001 ) ;
app.set( 'cfgLapse_Gen_HTML', 180000 ) ; // mili-segons - gen HTML every ... 5 minuts = 300 segons, 3 minuts = 180 seg.
app.set( 'cfgLapse_Do_Ping', 5000 ) ;    // mili-segons - do Ping every ... 5 seconds


// set where do we serve HTML pages from

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

    var szOut = (new Date).yyyymmdd() + '-' + (new Date).hhmmss() ;
//    console.log( 'gen a TimeStamp {' + szOut + '}' ) ;
    return szOut ;

} ; // genTimeStamp()


// lets implement what to do when the TIMEOUT lapse expires

// (1) ping timeout

function myTimeout_Do_Ping_Function ( arg ) { // ping a un soci

    var iPing_IP = dades_socis [ idxSoci ].ip ;
    var szOut = ">>> timeout Ping soci " + idxSoci + "/" + iNumSocis + ". " ;
    szOut += "Stamp {" + genTimeStamp() + '}, IP {' + iPing_IP + '}, nom {' + dades_socis [ idxSoci ].user + '}' ;
    console.log( szOut ) ;

// fem ping() amb python

    python_options.args[0] = iPing_IP ; // set IP to ping in python params

    PythonShell.run( '2_do_ping.py', python_options, function( err, results ) {

        if ( err ) throw err;
        console.log( '(+) Python results (%j).', results ) ;
// results is an array consisting of messages collected during execution

// if "RC 0"  then "on", if "RC KO" then "off"

        var ss_OK = "RC 0" ;
        var idx = results.indexOf( ss_OK ) ; // "-1" means "not found"
//        console.log( '(#) PING result (%j).', idx ) ;

        if ( idx > 0 ) { // substring found

            if ( dades_socis [ idxSoci ].status != '+' ) { // ip comes up
                console.log( '(#) IP (%s) comes UP. Stamp (%s).', iPing_IP, (new Date).hhmmss() ) ;
            } ;

            dades_socis [ idxSoci ].status = '+' ; // set IP is UP

        } else {

            if ( dades_socis [ idxSoci ].status != '-' ) { // ip comes down right now
                console.log( '(#) IP (%s) goes DOWN. Stamp (%s).', iPing_IP, (new Date).hhmmss() ) ;
            } ;

            dades_socis [ idxSoci ].status = '-' ; // set IP is DOWN

        } ;

    } ) ; // python shell


// apuntem al soci seguent

    idxSoci = idxSoci + 1 ;
    if ( idxSoci >= iNumSocis ) { idxSoci = 0 ; } ;

} ; // myTimeout_Do_Ping_Function()


// (2) generate HTML timeout

function myTimeout_Gen_HTML_Function ( arg ) { // generar pagina HTML

// generate new page "/public/pagina.html" so client gets fresh data

//   (b1) delete the file we shall create, "pagina.nova"
//   (b2) create "pagina.nova"
//   (b3) delete old "pagina.html"
//   (b4) rename "pagina.nova" as "pagina.html

// (b1) 

    var newFN = './public/pagina.nova' ;
//    console.log( '(b1) delete ' + newFN ) ;

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
//        console.log( '(b2) create ' + newFN ) ;

        var S1 = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/html40/loose.dtd">\n' ;
        S1 += '<HTML> <HEAD>\n' ;
        S1 += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8">\n' ;
        S1 += '<META HTTP-EQUIV="Refresh" CONTENT="30;URL=./pagina.html">\n' ;
        S1 += '<LINK REL="SHORTCUT ICON" HREF="./favicon.ico";>\n' ;
        S1 += '<LINK REL=STYLESHEET HREF="pagina.css" TYPE="text/css">\n' ;
        S1 += '<TITLE>' + 'Its ' + (new Date).hhmmss() + '</TITLE>\n' ;
        S1 += '</HEAD>\n <BODY>\n' ;

        var S2 = '<hr>\n <table class="t_socis">' ;
        S2 += '<tr> <th> Nom <th> IP <th> Timestamp </tr>' ;

        var szTR = '.' ;

        dades_socis.forEach( function ( soci, index ) {
            if ( dades_socis [index].status == '+' ) {
                szTR = '<tr class="t_soci_working">' ;
            } else {
                szTR = '<tr class="t_soci_aturat">' ;
            } ;
            S2 += szTR + '<td>' + dades_socis [index].user + '<td>' + dades_socis [index].ip + '<td>' + (new Date).hhmmss() + '</tr>\n' ;

        } ) ; // forEach()

        var S3 = '</table> <hr>\n </BODY>\n </HTML>\n' ;

        fs.writeFile( newFN, S1+S2+S3, (err) => {
            if (err) throw err;
            console.log( '+++ (b2) file ' + newFN + ' has been saved!' ) ;

// (b3)
            var oldFN = './public/pagina.html' ;
//            console.log( '(b3) delete ' + oldFN ) ;
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
//                console.log( '(b4) rename ' + oldFN + ' as ' + newFN ) ;

                fs.rename( oldFN, newFN, (err) => {
                    if (err) throw err;
                    console.log( '+++ (b4) renamed complete ' + newFN ) ;
                });

            } ) ; // synch delete "pagina.html"

        } ) ; // write "pagina.nova"

    } ) ; // synch delete "pagina.nova"

} ; // myTimeout_Gen_HTML_Function()


// llegir les dades dels socis

fs.readFile( fitxer_socis, 'utf8', function ( err, dadesJSON ) {

    if ( err ) throw err ;

    console.dir( "in" + dadesJSON ) ;
    dades_socis = JSON.parse( dadesJSON ) ;
    iNumSocis = dades_socis.length ; 

    dades_socis.forEach( function ( soci, index ) {
        console.log( "Index " + index + "/" + iNumSocis + " has" ) ;
        console.log( "\tout.user   \t"   + dades_socis [index].user ) ;
        console.log( "\tout.ip     \t"   + dades_socis [index].ip ) ;
        console.log( "\tout.tf     \t"   + dades_socis [index].tf ) ;
        console.log( "\tout.status \t"   + dades_socis [index].status ) ;
    } ) ; // forEach()

} ) ; // readFile()


// set 2 repetitive timeouts

//    console.log( "set TO html, timestamp" + (new Date).hhmmss() ) ;
    setInterval( myTimeout_Gen_HTML_Function, app.get( 'cfgLapse_Gen_HTML' ) ) ; // lets call own function every defined lapse

//    console.log( "set TO ping, timestamp" + (new Date).hhmmss() ) ;
    setInterval( myTimeout_Do_Ping_Function, app.get( 'cfgLapse_Do_Ping' ) ) ;   //


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

// (2) if customer asks for "root" page, we display the inital page

app.get( '/', function (req, res) {
    res.sendFile(__dirname + '/public/inici.html');
}) ; // get "/"


// start server

var listener = app.listen( app.get( 'cfgPort' ), function () {
    console.log( '(in) app listening on port', listener.address().port )
})

console.log( '(out) APP listening at port', app.get( 'cfgPort' ) ) ;

