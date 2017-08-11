//
// This APP generates a HTML page every Timeout.
// The data is collected using a python "ping" on a list of IPs we read from a configuration file.
//
// Test it using 
//
//    http://192.168.1.123:3001/
//    http://192.168.1.123:3001/pagina.html     auto-reload every 30 seconds
//    curl http://127.0.0.1:3001
//    curl http://127.0.0.1:3001/ping
//    curl http://127.0.0.1:3001/pagina.html
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
//    . enviar correu quan un node caigui i estigui aixi una estoneta
//
// Requisits : nodejs i python (see README.MD)
//
// Llista de versions :
//
// 1.1.a - start code
// 1.1.b - delete old file, create new one
// 1.1.c - llegir socis.json
// 1.1.d - fer ping() des python
// 1.1.e - favicon.ico
// 1.1.f - Bitacora : posar events i llistar des menu
// 1.1.g - minimal cfg file, rest is created
// 1.1.h - improve ping() return text search
//

var myVersio     = "v1.1.h" ;

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
    pythonPath: '/usr/bin/python',     // in Windows, must be blank, as we did set PYTHONPATH envir var
    pythonOptions: ['-u'],
    scriptPath: '/home/pi/timer',                        // in Windows, must be as "c:/sebas/miscosas/node/timer"
#    scriptPath: '/home/sebas/node_projects/timer',      // in Ubuntu, this is the location of the python file
    args: ['value1', 'value2']
} ;

var Bitacora = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a',   
                 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k' ] ;  // lets have 20 elements

// set some values in global var APP

app.set( 'cfgPort', process.env.PORT || 3001 ) ;
app.set( 'cfgLapse_Gen_HTML', 180000 ) ; // mili-segons - gen HTML every ... 5 minuts = 300 segons, 3 minuts = 180 seg.
app.set( 'cfgLapse_Do_Ping', 4000 ) ;    // mili-segons - do Ping every ... 4 seconds


// set where do we serve HTML pages from

    app.use( '/', express.static(__dirname + '/public') ) ; // serve whatever is in the "public" folder at the URL <root>/:filename


// ======== ======== ======== ======== implement few own functions

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


// Bitacora : save important events and list them on demand.

function Poner_Bitacora ( szIn ) { // save an important event

var szOut = (new Date).yyyymmdd() + '-' + (new Date).hhmmss() + ' ' + szIn ;

    console.log( 'Posar bitacora : ' + szOut ) ; // first, write to console
    var newLength = Bitacora.unshift( szOut ) ;  // add to the front
    var last      = Bitacora.pop() ;             // remove from the end
    return 0 ;

} ; // Poner_Bitacora()


function Listar_Bitacora () { // return the last events

//    console.log( '>>> Listar bitacora' ) ;

    var szOut = " " ;

    Bitacora.forEach( function( item, index, array ) {
//        console.log( index, item ) ;
        szOut += item + '<br>' ;
    } ) ;

    return szOut ;

} ; // Listar_Bitacora()


// lets implement what to do when the TIMEOUT lapse expires

// (1) ping timeout

function myTimeout_Do_Ping_Function ( arg ) { // ping a un soci

var szNow ; // to get timestamp
var szLog ; // to write into log and Bitacora

    var iPing_IP = dades_socis [ idxSoci ].ip ;
    var szOut = ">>> timeout Ping soci " + idxSoci + "/" + iNumSocis + ". " ;
    szOut += "Stamp {" + genTimeStamp() + '}, ' ;
    szOut += 'IP {' + iPing_IP + '}, ' ;
    szOut += 'nom {' + dades_socis [ idxSoci ].user + '}, ' ;
    szOut += 'q {' + dades_socis [ idxSoci ].status + '}' ;
    console.log( szOut ) ;

// fem ping() amb python

    python_options.args[0] = iPing_IP ; // set IP to ping in python params

    PythonShell.run( '2_do_ping.py', python_options, function( err, results ) { // call python code implementing "ping()"

        if ( err ) throw err;
        console.log( '(+) Python results (%j).', results ) ; // results is an array of messages collected during execution

// if "RC 0"  then "on", if "RC KO" then "off"

        var ss_OK = "RC 0" ;
        var idx = results[1].indexOf( ss_OK ) ; // search meaningful string : "-1" means "not found"
//        console.log( '(#) PING result IDX str (%s) in (%s) is (%j).', ss_OK, results[1], idx ) ;

        szNow = (new Date).hhmmss() ; // get timestamp
        if ( idx >= 0 ) { // substring found, meaning IP is ALIVE at this moment

            if ( dades_socis [ idxSoci ].status != '+' ) { // ip was not up => ip comes up right now
                dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went up
                szLog = '(#) IP (' + iPing_IP + ') comes UP. Stamp (' + szNow + ').' ;
                Poner_Bitacora( szLog ) ;
            } ;

            dades_socis [ idxSoci ].status = '+' ; // set IP is UP

        } else { // substring not found, meaning IP is DEAD at this moment

            if ( dades_socis [ idxSoci ].status != '-' ) { // ip was not down => ip goes down right now
                dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went down
                szLog = '(#) IP (' + iPing_IP + ') goes DOWN. Stamp (' + szNow + ').' ;
                Poner_Bitacora( szLog ) ;
            } ;

            dades_socis [ idxSoci ].status = '-' ; // set IP is DOWN

        } ;

        // apuntem al soci seguent

        idxSoci = idxSoci + 1 ;
        if ( idxSoci >= iNumSocis ) { idxSoci = 0 ; } ;

    } ) ; // python shell call

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
        S1 += '<HTML>\n<HEAD>\n' ;
        S1 += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8">\n' ;
        S1 += '<META HTTP-EQUIV="Refresh" CONTENT="30;URL=./pagina.html">\n' ;
        S1 += '<LINK REL="SHORTCUT ICON" HREF="./favicon.ico";>\n' ;
        S1 += '<LINK REL=STYLESHEET HREF="pagina.css" TYPE="text/css">\n' ;
        S1 += '<TITLE>' + 'Its ' + (new Date).hhmmss() + '</TITLE>\n' ;
        S1 += '</HEAD>\n<BODY>\n' ;

        var S2 = '<hr>\n <table class="t_socis">' ;
        S2 += '<tr> <th> Nom <th> IP <th> Timestamp </tr>' ;

        var szTR = '.' ;

        dades_socis.forEach( function ( soci, index ) {

            if ( dades_socis [index].status == '+' ) {
                szTR = '<tr class="t_soci_working">' ;
            } else {
                szTR = '<tr class="t_soci_aturat">' ;
            } ;
            S2 += szTR + '<td>' + dades_socis [index].user ;
            S2 += '<td>' + dades_socis [index].ip + '<td>' + dades_socis [index ].timestamp + '</tr>\n' ;

        } ) ; // forEach()

        var S3 = '</table> <hr>\n </BODY>\n </HTML>\n' ;

        fs.writeFile( newFN, S1+S2+S3, (err) => {
            if (err) throw err ;
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
                    if (err) throw err ;
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
    iNumSocis = dades_socis.length ;        // set var for this run

    dades_socis.forEach( function ( soci, index ) {

        dades_socis [index].status    = '+' ; // create new fields ...
        dades_socis [index].timestamp = ' ' ; // ... that are calculated by program, not initial or constant values
 
        console.log( "Index " + index + "/" + iNumSocis + " has" ) ;
        console.log( "\tout.user      \t"   + dades_socis [index].user ) ;
        console.log( "\tout.ip        \t"   + dades_socis [index].ip ) ;
        console.log( "\tout.tf        \t"   + dades_socis [index].tf ) ;
        console.log( "\tout.status    \t"   + dades_socis [index].status ) ;
        console.log( "\tout.timestamp \t"   + dades_socis [index].timestamp ) ;

    } ) ; // forEach()

} ) ; // readFile()


// set 2 repetitive timeouts

//    console.log( "set TO html, timestamp" + (new Date).hhmmss() ) ;
    setInterval( myTimeout_Gen_HTML_Function, app.get( 'cfgLapse_Gen_HTML' ) ) ; // lets call own function every defined lapse

//    console.log( "set TO ping, timestamp" + (new Date).hhmmss() ) ;
    setInterval( myTimeout_Do_Ping_Function, app.get( 'cfgLapse_Do_Ping' ) ) ;   //


// implement branches answering the client requests

// (1) if customer asks for "events", we send list from Bitacora

app.get( '/events', function ( req, res ) {

    console.log( ">>> got /EVENTS." ) ;

    var texte = "<HTML>\n<HEAD>\n" ;
    texte += '<LINK REL=STYLESHEET HREF="pagina.css" TYPE="text/css">\n' ;
    texte += '<TITLE>' + 'Events at ' + (new Date).hhmmss() + '</TITLE>\n' ;
    texte += '</HEAD>\n<BODY>\n' ;
    texte += "<hr> <h1>Hello from Odin, versio " + myVersio + ". Now is (" + genTimeStamp() + ")</h1>\n<hr>\n" ;
    texte += '<div class="txt_ajuda" style="font-family: Lucida Console">' ;
    texte += Listar_Bitacora() ;
    texte += '</div><hr>\n</BODY>\n</HTML>' ;

//     console.log( ">>> Send : " + texte ) ;

    res.writeHead( 200, { 'Content-Type': 'text/html' } ) ; // write HTTP headers 
    res.write( texte ) ;
    res.end( ) ;

} ) ; // get '/events'

// (2) if customer asks for "root" page, we display the inital page

app.get( '/', function (req, res) {

    console.log( ">>> got /ROOT. Send INICI.HTML " ) ;
    res.sendFile( __dirname + '/public/inici.html' ) ;

}) ; // get "/"


// start server

var listener = app.listen( app.get( 'cfgPort' ), function () {
    console.log( '(in) app listening on port', listener.address().port )
})

console.log( '(out) APP listening at port', app.get( 'cfgPort' ) ) ;

