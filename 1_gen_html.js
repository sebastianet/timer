//
// This APP generates a HTML page every Timeout..
// The data is collected using a python "ping" on a list of IPs we read from a configuration file, "entrada.json"
// As user IPs are in the guifi network, the server must be connected to WLAN_GAS2 wifi network.
//
// Code at
//
//    rspi    /home/pi/timer                          (xarxa enxaneta)
//    GIT     https://github.com/sebastianet/timer    (public repository)
//    T60     /home/sebas/node_projects/timer         (xarxa WLAN_GAS2)
//    PC      C:\sebas\miscosas\node\timer            (xarxa WLAN_GAS2)
//    pomnia  /home/users/mate/nodejs-projects/timer  (xarxa guifi)
//
// Configuration - 3 files are provided; one has to be copied into "entrada.json" 
//
//    struct.json    : super nodes
//    socis.json     : user/client nodes
//    tot.json       : all nodes, supernodes and user/client nodes
//
// Run it using
//    sudo node 1_gen_html.js  entrada.json
//
// Output
//    program writes onto console.log, that can be redirected to a file from ru.sh
//
// Test it using 
//
//    http://192.168.1.123:3001/
//    http://192.168.1.123:3001/pagina.html     auto-reloads every 30 seconds
//    http://10.139.130.117:3002/               des guifi-Torrelles
//
//    curl http://127.0.0.1:3001
//    curl http://127.0.0.1:3001/ping
//    curl http://127.0.0.1:3001/pagina.html
//
// GIT commands
//
//    https://github.com/sebastianet            root of all my projects
//    git commit -am "descripcio"               commit code as is now at source (Raspi)
//    git push -u origin master                 send it to repository (github)
//    git pull                                  get code at server (T60)
//
// URLs :
//
//    https://github.com/sebastianet/wCDT/blob/master/my_server.js
//    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//    https://nodejs.org/api/fs.html#fs_file_system
//    https://github.com/extrabacon/python-shell
//    https://nodejs.org/api/errors.html
//    https://www.loggly.com/blog/exceptional-logging-of-exceptions-in-python/
//    https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
//    https://nodejs.org/api/util.html
//    https://www.npmjs.com/package/node-wget
//    https://www.npmjs.com/package/request
//    https://nodejs.org/api/http.html
//    https://www.npmjs.com/package/superagent     sudo npm install superagent
//    https://visionmedia.github.io/superagent/
//    https://github.com/palbcn/nodesmonitor 
//
// Pendent :
//
//    . enviar correu quan un node caigui i estigui aixi una estoneta
//    . fer servir logger as Winston or Morgan
//    . https://stackoverflow.com/questions/54328388/wget-to-tmp-wget-produces-emfile-too-many-open-files
//
// Requisits : nodejs i python (see README.MD)
//
// www :
//
//    if T60 or PuntOmnia sends HTML via FTP, then we can see
//    ... https://torrelles-guifi.000webhostapp.com/pagina.html
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
// 1.1.i - uniform timestamp in log
// 1.1.j - mConsole() controla la sortida a log i posa timestamp
// 1.1.k - comptar antenes on/off i mostrar
// 1.1.l - camp "lnk" al fitxer de socis
// 1.1.m - manage "Division by zero" in python
// 1.1.n - improve "Division by zero" error
// 1.1.o - try to catch "Division by zero" in python
// 1.1.p - update customer IP list
// 1.2.a - provide multiple input files
// 1.2.b - locate JSON file in actual dir
// 1.3.a - pass config file as cmd line param
// 1.3.b - use __dirname as write(pagina.nueva) fail from omnia_restart
//           write pagina.html directly, without "delete" neither "move" from pagina.nueva
// 1.3.c - mostrar Homepage al Estat de les Antenes
// 1.3.d - no fer servir colsole.log enlloc, sino mConsole()
// 1.3.e - use util.format as sprintf()
// 1.3.f - fix Rafael Ruiz and Josep Montserrat
// 1.3.g - display hostname in generated html
// 1.3.h - fix Montse Potrony
// 1.3.i - fix Luis Mabilon
// 1.3.j - try to catch SIGHUP to reload config file
//           sudo   kill -1  1319 ; where 1319 is the output of "ps -ef | grep 1_g"
// 1.3.k - fix mConsole input at start
// 1.3.l - improve Title
// 2.0.a - use WGET() instead of PING() - https://github.com/angleman/wgetjs.git
// 2.0.b - fix Error: EMFILE: too many open files, open '/tmp/wget/10.139.238.130' - use "dry: true" - no va
//           command to display number of open handles : lsof -i -n -P | grep nodejs
// 2.0.c - try to close the file or delete it
//           pend - https://www.npmjs.com/package/request - simplified HTTP client
// 2.0.d - fs.close() before fs.unlink()
// 2.0.e - remove fs.close() as it requires a FD, which I do not have
// 2.0.f - specify destination filename /tmp/wget/fn_wget.txt
// 2.0.g - use require( 'wgetjs' ) instead of require( 'node-wget' )
// 2.0.h - borrar fitxer directe, remove 2.0.g
// 2.0.i - dont delete but overwrite
// 2.0.j - delete plus https://github.com/isaacs/node-graceful-fs : npm install graceful-fs --save
// 2.0.k - remove graceful-fs : internal/fs/utils.js:458
// 2.0.l - say "require('dotenv').config()"
// 2.0.m - put graceful
// 2.1.a - use REQUEST() instead of WGET() {gracies, Pere}
// 2.1.b - SUPERAGENT {Pere again}
// 2.1.c - acceptar qualsevol resposta del servidor com OK
// 2.1.d - faltava "�)" en detectar EADDRINUSE
//

var myVersio     = "v2.1.d" ;

var express      = require( 'express' ) ;
var app          = express() ;

 require('dotenv').config() ;

var wget         = require( 'node-wget' ) ; // https://www.npmjs.com/package/node-wget
// var wget        = require( 'wgetjs' ) ; // https://github.com/angleman/wgetjs
var request      = require( 'request' ) ;   // https://www.npmjs.com/package/request
const superagent = require('superagent');

var fs           = require( 'fs' ) ; // manage filesystem
// var fs          = require( 'graceful-fs' ) ; // manage filesystem
var PythonShell  = require( 'python-shell' ) ;
var util         = require( 'util' ) ;

var iNumSocis ;                    // numero actual de socis
var dades_socis ;                  // guardem les dades 
var idxSoci = 0 ;                  // soci amb el que estem treballant ara mateix
var Detalls = 1 ;                  // control de la trassa que generem via "mConsole"
var szTraza = " " ;                // input to mConsole


// equivalent of "--no-check-certificate", prevent DEPTH_ZERO_SELF_SIGNED_CERT error
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0 ; 

var mkdirp = require( 'mkdirp' ) ;

mkdirp('/tmp/wget', function (err) {
    if (err) console.error(err)
    else console.log( '+++ dir /tmp/wget created' ) ;
} ) ; // mkdirp 

var python_options = {
    mode: 'text',
    pythonPath: '/usr/bin/python',     // in Windows, must be blank, as we did set PYTHONPATH envir var
    pythonOptions: ['-u'],
//    scriptPath: '/home/pi/timer',                      // location of the python file .. in Odin
//    scriptPath: 'c:/sebas/miscosas/node/timer',        // .. in Windows
//    scriptPath: '/home/sebas/node_projects/timer',     // .. in T60 Ubuntu
    scriptPath: '/home/mate/nodejs-projects/timer',    //..  in Punt Omnia Ubuntu
    args: ['value1', 'value2']
} ;

var Bitacora = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a',   
                 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k' ] ;  // lets have 20 elements


// get command line parameters - $ node yourscript.js banana monkey

var program_name = process.argv[0] ; // value will be "node"
var script_path  = process.argv[1] ; // value will be "yourscript.js"
var first_value  = process.argv[2] ; // value will be "banana"

// var fitxer_entrada    = "./entrada.json" ;  // copy either socis or struct or "tot.json" onto entrada to set value
var fitxer_entrada = process.argv[2] ;         // see ru.sh !

// set some values in global var APP

    app.set( 'cfgPort', process.env.PORT || 3001 ) ;      // set port
    app.set( 'cfgLapse_Gen_HTML', 300000 ) ;              // mili-segons - gen HTML every ... 5 minuts = 300 segons, 3 minuts = 180 seg.
    app.set( 'cfgLapse_Do_Ping', 4000 ) ;                 // mili-segons - do Ping every ... 4 seconds
    app.set( 'appHostname', require('os').hostname() ) ;  // save hostname


// set where do we serve HTML pages from

    app.use( '/', express.static(__dirname + '/public') ) ; // serve whatever is in the "public" folder at the URL <root>/:filename


// implement few own functions

function genTimeStamp ( arg ) {

    var szOut = (new Date).yyyymmdd() + ' - ' + (new Date).hhmmss() ;
//    console.log( 'gen a TimeStamp {' + szOut + '}' ) ;
    return szOut ;

} ; // genTimeStamp()

function mConsole ( szIn ) {

    if ( Detalls == 1 ) {
        console.log( genTimeStamp() + ' - ' + szIn ) ;
    } ;

} ; // mConsole()

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


// Bitacora : save important events and list them on demand.

function Poner_Bitacora ( szIn ) { // save an important event

var szOut = genTimeStamp() + ' ' + szIn ;

    mConsole( '(###) Posar bitacora : ' + szIn ) ; // first, write to console
    var newLength = Bitacora.unshift( szOut ) ;    // add to the front
    var last      = Bitacora.pop() ;               // remove from the end
    return 0 ;

} ; // Poner_Bitacora()


function Listar_Bitacora () { // return the last events

//    mConsole( '>>> Listar bitacora' ) ;

    var szOut = " " ;

    Bitacora.forEach( function( item, index, array ) {
//        console.log( index, item ) ;
        szOut += item + '<br>' ;
    } ) ;

    return szOut ;

} ; // Listar_Bitacora()


// try to reload configuration on user request

process.on( 'SIGHUP', () => {
  console.log( '+++ Received SIGHUP.' ) ;
  llegir_JSON( fitxer_entrada ) ;
}) ;


// lets implement what to do when the TIMEOUT lapse expires

// (1).old.1 - ping next IP timeout

function myTimeout_Do_Ping_Function ( arg ) { // ping a un soci

var szNow ; // to get timestamp
var szLog ; // to write into log and Bitacora

    var iPing_IP = dades_socis [ idxSoci ].ip ;
    var szOut = " >>> timeout fer Ping. Soci " + idxSoci + "/" + iNumSocis + ". " ;
    szOut += 'IP {' + iPing_IP + '}, ' ;
    szOut += 'nom {' + dades_socis [ idxSoci ].user + '}, ' ;
    szOut += 'q {' + dades_socis [ idxSoci ].estatus + '}' ;
    mConsole( szOut ) ;

// fem ping() amb python

    python_options.args[0] = iPing_IP ; // set IP to ping in python params

    PythonShell.run( '2_do_ping.py', python_options, function( err, results ) { // call python code implementing "ping()"

        if ( err ) {
            mConsole( '--- Python error ' + JSON.stringify( err ) ) ;
            mConsole( '--- Error message is (' + err.message + ').' ) ;
//            if ( err.code == 'ZeroDivisionError' ) { // accept this error
            if ( err.errno === 'ZeroDivisionError' ) { // accept this error
                results[1] = '-' ;
            } else { 
                throw err ; // fatal error : stop
            }
        } ;
        
//        if ( err ) throw err;

        szOut = util.format( "(+) Python results ( %s )", results ) ; // results is an array of messages collected during execution
        mConsole( szOut ) ; 

// if "RC 0"  then "on", if "RC KO" then "off"

        var ss_OK = "RC 0" ;
        var idx = results[1].indexOf( ss_OK ) ; // search meaningful string : "-1" means "not found"
//        console.log( '(#) PING result IDX str (%s) in (%s) is (%j).', ss_OK, results[1], idx ) ;

        szNow = genTimeStamp() ; // get timestamp
        if ( idx >= 0 ) { // substring found, meaning IP is ALIVE at this moment

            if ( dades_socis [ idxSoci ].estatus != '+' ) { // ip was not up => ip comes up right now

                dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went up
                dades_socis [ idxSoci ].count = 0 ;         // set count to 0

                szLog = '+++ .UP. +++ ip (' + iPing_IP + ') soci (' + dades_socis [ idxSoci ].user + ').' ;
                Poner_Bitacora( szLog ) ;

            } else { // ip was up and is up again, so count the event
                dades_socis [ idxSoci ].count = dades_socis [ idxSoci ].count +1 ;     // count "on" periods
            } ;

            dades_socis [ idxSoci ].estatus = '+' ; // set IP is UP

        } else { // substring not found, meaning IP is DEAD at this moment

            if ( dades_socis [ idxSoci ].estatus != '-' ) { // ip was not down => ip goes down right now

                dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went down
                dades_socis [ idxSoci ].count = 0 ;         // set count to 0

                szLog = '--- DOWN --- ip (' + iPing_IP + ') soci (' + dades_socis [ idxSoci ].user + ').' ;
                Poner_Bitacora( szLog ) ;

            } else { // ip was down and is down again, so count the event
                dades_socis [ idxSoci ].count = dades_socis [ idxSoci ].count +1 ;     // count "off" periods
            } ;

            dades_socis [ idxSoci ].estatus = '-' ; // set IP is DOWN

        } ;

        // apuntem al soci seguent

        idxSoci = idxSoci + 1 ;
        if ( idxSoci >= iNumSocis ) { idxSoci = 0 ; } ;

    } ) ; // python shell call

} ; // myTimeout_Do_Ping_Function()


// (1).old.2 - do WGET on the next IP

function myTimeout_Do_Wget_Function ( arg ) { // do a WGET on next IP

var szNow ; // to get timestamp
var szLog ; // to write into log and Bitacora

    var iWget_IP = dades_socis [ idxSoci ].ip ;
    var szOut = " >>> timeout per fer WGET(). Soci " + idxSoci + "/" + iNumSocis + ". " ;
    szOut += 'IP {' + iWget_IP + '}, ' ;
    szOut += 'nom {' + dades_socis [ idxSoci ].user + '}, ' ;
    szOut += 'q {' + dades_socis [ idxSoci ].estatus + '}' ;
    mConsole( szOut ) ;

// fem wget() 

    var szTargetIP = 'http://' + iWget_IP ;

    wget( {
            url:  szTargetIP,   // 'https://raw.github.com/angleman/wgetjs/master/package.json',
            dest: '/tmp/wget/fn_wget.txt', // destination path or path with filename, default is ./
            timeout: 2000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
//            dry: true           // nothing loaded => always OK, no timeout
        },
        function ( error, response, body ) {

            szNow = genTimeStamp() ; // get timestamp

            if (error) {

                console.log( '--- wget() error:' ) ;
                console.log( error ) ;            // error encountered

                if ( dades_socis [ idxSoci ].estatus != '-' ) { // ip was not down => ip goes down right now

                    dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went down
                    dades_socis [ idxSoci ].count = 0 ;         // set count to 0

                    szLog = '--- DOWN --- ip (' + iWget_IP + ') soci (' + dades_socis [ idxSoci ].user + ').' ;
                    Poner_Bitacora( szLog ) ;

                } else { // ip was down and is down again, so count the event
                    dades_socis [ idxSoci ].count = dades_socis [ idxSoci ].count +1 ;     // count "off" periods
                } ;

                dades_socis [ idxSoci ].estatus = '-' ; // set IP is DOWN

            } else {

                console.log( '+++ wget() ok' ) ;

                if ( dades_socis [ idxSoci ].estatus != '+' ) { // ip was not up => ip comes up right now

                    dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went up
                    dades_socis [ idxSoci ].count = 0 ;         // set count to 0

                    szLog = '+++ .UP. +++ ip (' + iWget_IP + ') soci (' + dades_socis [ idxSoci ].user + ').' ;
                    Poner_Bitacora( szLog ) ;

                } else { // ip was up and is up again, so count the event
                    dades_socis [ idxSoci ].count = dades_socis [ idxSoci ].count +1 ;     // count "on" periods
                } ;

                dades_socis [ idxSoci ].estatus = '+' ; // set IP is UP

            } ; // no error = wget() ok

            // apuntem al soci seguent
            idxSoci = idxSoci + 1 ;
            if ( idxSoci >= iNumSocis ) { idxSoci = 0 ; } ;

        } 
    ) ; // wget()

//      var szIPfn = '/tmp/wget/' + iWget_IP ;   // filename to close and/or delete
    var szIPfn = '/tmp/wget/fn_wget.txt' ;   // filename to close and/or delete
    szLog = '*** remove WGET file (' + szIPfn + ') ***' ;
    Poner_Bitacora( szLog ) ;

//    fs.close( szIPfn, err => {
//        if (err) throw err ;
                                          // https://stackoverflow.com/questions/5315138/node-js-remove-file
        fs.unlink( szIPfn, (err) => {     // delete file

            if (err) {
                if ( err.code === 'ENOENT' ) {
                    mConsole( '--- file '+ szIPfn +' does not exist' ) ;
                } else {
                    throw err ; // fatal error : stop
                } ;
            } else {
                mConsole( '+++ successfully deleted ' + szIPfn ) ;
            } ;
        } ) ; // unlink

//    } ) ; // close

} ; // myTimeout_Do_Wget_Function()


// (1).old.3 - do REQUEST() on the next IP

function myTimeout_Do_Request_Function ( arg ) { // request() next IP

var szNow ; // to get timestamp
var szLog ; // to write into log and Bitacora

    var iWget_IP = dades_socis [ idxSoci ].ip ;
    var szTargetIP = 'http://' + iWget_IP ;

    var szOut = ">>> timeout per fer REQUEST(). Soci " + idxSoci + "/" + iNumSocis + ". " ;
    szOut += 'IP {' + iWget_IP + '}, ' ;
    szOut += 'nom {' + dades_socis [ idxSoci ].user + '}, ' ;
    szOut += 'q {' + dades_socis [ idxSoci ].estatus + '}' ;
    mConsole( szOut ) ;

    request( szTargetIP, {timeout: 1500}, function ( error, response, body ) {

        szNow = genTimeStamp() ; // get timestamp

//        if ( !error && response.statusCode == 200 ) {
        if ( !error ) {

            szLog = '+++ request() ok. ip (' + iWget_IP + ') q(' + response.statusCode + ').' ;
            console.log( szLog ) ;

            if ( dades_socis [ idxSoci ].estatus != '+' ) { // ip was not up => ip comes up right now

                dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went up
                dades_socis [ idxSoci ].count = 0 ;         // set count to 0

                szLog = '+++ .UP. +++ ip (' + iWget_IP + ') soci (' + dades_socis [ idxSoci ].user + ').' ;
                Poner_Bitacora( szLog ) ;

            } else { // ip was up and is up again, so count the event
                dades_socis [ idxSoci ].count = dades_socis [ idxSoci ].count +1 ;     // count "on" periods
            } ;
            dades_socis [ idxSoci ].estatus = '+' ; // set IP is UP
        }
        else {

            console.log( '--- request() error: ' + error ) ;

            if ( dades_socis [ idxSoci ].estatus != '-' ) { // ip was not down => ip goes down right now

                dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went down
                dades_socis [ idxSoci ].count = 0 ;         // set count to 0

                szLog = '--- DOWN --- ip (' + iWget_IP + ') soci (' + dades_socis [ idxSoci ].user + ').' ;
                Poner_Bitacora( szLog ) ;

            } else { // ip was down and is down again, so count the event
                dades_socis [ idxSoci ].count = dades_socis [ idxSoci ].count +1 ;     // count "off" periods
            } ;

            dades_socis [ idxSoci ].estatus = '-' ; // set IP is DOWN
        } ; // else

        // apuntem al soci seguent
        idxSoci = idxSoci + 1 ;
        if ( idxSoci >= iNumSocis ) { idxSoci = 0 ; } ;

    } ) ; // request()

} ; // myTimeout_Do_Request_Function()


// (1).new - use SUPERAGENT
function myTimeout_Do_SuperAgent_Function ( arg ) { // superagent() next IP

var szNow ; // to get timestamp
var szLog ; // to write into log and Bitacora

    var iWget_IP = dades_socis [ idxSoci ].ip ;
    var szTargetIP = 'http://' + iWget_IP ;

    var szOut = ">>> timeout per fer SUPERAGENT(). Soci " + idxSoci + "/" + iNumSocis + ". " ;
    szOut += 'IP {' + iWget_IP + '}, ' ;
    szOut += 'nom {' + dades_socis [ idxSoci ].user + '}, ' ;
    szOut += 'q {' + dades_socis [ idxSoci ].estatus + '}' ;
    mConsole( szOut ) ;

    superagent
        .get( szTargetIP ) 
        .timeout({
            response: 3000,  // wait 3 seconds for the server to start sending,
            deadline: 15000, // but allow 15 seconds for the file to finish loading.
         })
        .end( function( err, data ) {

            szNow = genTimeStamp() ; // get timestamp

            var bAcceptable = ( !err ) ||
                              ( ( err ) && ( err.message == 'self signed certificate' ) ) ||
                              ( ( err ) && ( err.message == 'Unauthorized' ) ) ||
                              ( ( err ) && ( err.message == 'Not Found' ) ) ;
//            var bAcceptable = !err || err.status ;
            if ( bAcceptable ) {

                szLog = '+++ superagent() acceptable response. IP (' + iWget_IP + '). ' ;
                if ( err ) {
                    szLog += 'Error message (' + err.message + '), status (' + err.status + '). ' ;
                } ;
                mConsole( szLog ) ;

                if ( dades_socis [ idxSoci ].estatus != '+' ) { // ip was not up => ip comes up right now

                    dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went up
                    dades_socis [ idxSoci ].count = 0 ;         // set count to 0

                    szLog = '+++ .UP. +++ ip (' + iWget_IP + ') soci (' + dades_socis [ idxSoci ].user + ').' ;
                    Poner_Bitacora( szLog ) ;

                } else { // ip was up and is up again, so count the event
                    dades_socis [ idxSoci ].count = dades_socis [ idxSoci ].count +1 ;     // count "on" periods
                } ;
                dades_socis [ idxSoci ].estatus = '+' ; // set IP is UP

            } else {

                szLog  = '--- superagent() error (' + err + '). ' ;
                szLog += 'Status (' + err.status + '). ' ;
                szLog += 'Message (' + err.message + '). ' ;
                mConsole( szLog ) ;

                if ( dades_socis [ idxSoci ].estatus != '-' ) { // ip was not down => ip goes down right now

                    dades_socis [ idxSoci ].timestamp = szNow ; // set timestamp of the moment ip went down
                    dades_socis [ idxSoci ].count = 0 ;         // set count to 0

                    szLog = '--- DOWN --- ip (' + iWget_IP + ') soci (' + dades_socis [ idxSoci ].user + ').' ;
                    Poner_Bitacora( szLog ) ;

                } else { // ip was down and is down again, so count the event
                    dades_socis [ idxSoci ].count = dades_socis [ idxSoci ].count +1 ;     // count "off" periods
                } ;

                dades_socis [ idxSoci ].estatus = '-' ; // set IP is DOWN

            } ;

            // apuntem al soci seguent
            idxSoci = idxSoci + 1 ;
            if ( idxSoci >= iNumSocis ) { idxSoci = 0 ; } ;
    } ) ;
} ; // myTimeout_Do_SuperAgent_Function


// (2) generate HTML timeout

function myTimeout_Gen_HTML_Function ( arg ) { // generar pagina HTML

// generate new page "/public/pagina.html" so client gets fresh data

    var szOut = ">>> timeout generar PAGINA.HTML, dirname {"+ __dirname + "}." ;
    mConsole( szOut ) ;

//   (b1) delete the file we shall create, "pagina.nova"            --- dont delete "pagina.nova"
//   (b2) create "pagina.nova"                                      --- write "pagina.nova" with "overwrite" flag
//   (b3) delete old "pagina.html"                                  --- delete "pagina.html"
//   (b4) rename "pagina.nova" as "pagina.html                      --- copy "pagina.nova" to "pagina.html"

// (b1) 

    var newFN = './public/pagina.nova' ;
    mConsole( '-(b1) delete ' + newFN ) ;

//    fs.unlink( newFN, (err) => {
//
//        if (err) {
//            if ( err.code === 'ENOENT' ) {
//                mConsole( '--- (b1) file '+ newFN +' does not exist' ) ;
//            } else {
//                throw err ; // fatal error : stop
//            } ;
//        } else {
//            mConsole( '+++ (b1) successfully deleted ' + newFN ) ;
//        } ;

// (b2)


        mConsole( '+(b2) create ' + newFN ) ;

        var S1 = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/html40/loose.dtd">\n' ;
        S1 += '<HTML>\n<HEAD>\n' ;
        S1 += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8">\n' ;
        S1 += '<META HTTP-EQUIV="Refresh" CONTENT="30;URL=./pagina.html">\n' ;
        S1 += '<LINK REL="SHORTCUT ICON" HREF="./favicon.ico";>\n' ;
        S1 += '<LINK REL=STYLESHEET HREF="pagina.css" TYPE="text/css">\n' ;
        S1 += '<TITLE>' + '*** qSocis at ' + (new Date).hhmmss() + ' ***</TITLE>\n' ;
        S1 += '</HEAD>\n<BODY>\n' ;

        var szTR = '.' ;
        var S3 = '' ;
        var nWorking = 0 ;
        var nAturat = 0 ;

        dades_socis.forEach( function ( soci, index ) {

            if ( dades_socis [index].estatus == '+' ) {
                szTR = '<tr class="t_soci_working">' ;
                nWorking += 1 ;
            } else {
                szTR = '<tr class="t_soci_aturat">' ;
                nAturat += 1 ;
            } ;
            S3 += szTR + '<td>' + index + '/' + iNumSocis ;
            S3 += '<td>' + dades_socis [index].user ;
            S3 += '<td>' + dades_socis [index].ip ;
            S3 += '<td>' + soci.lnk ;
            S3 += '<td>' + dades_socis [index ].timestamp ;
            S3 += '<td>' + dades_socis [index ].count ;
            S3 += '</tr>\n' ;

        } ) ; // forEach()

        var S2 = '<hr>\n <h1>Estat de les antenes @ ' + genTimeStamp() + ' [' + nWorking + ' on, ' + nAturat + ' off].</h1>\n' ;
        S2 += '<table class="t_socis">\n' ;
        S2 += '<tr> <th> id <th> Nom <th> IP <th> Link <th> Darrer canvi <th> Comptador</tr>\n' ;

        var S4 = '</table>\n<hr>\n' ;
        S4 += '<p>Tornar a la pagina <a href="./inici.html">principal</a> | ' ;
        S4 += 'Veure <a href="./events">events</a> (local net only) | ' ;
        S4 += '<a href="https://xarxatorrelles.cat/">Homepage Associacio Guifi Torrelles</a> - ' ;
        S4 += '/home/mate/nodejs-projects/timer/1_gen_html.js versio [' + myVersio + '] at host {' + app.get('appHostname') + '}.\n' ;
        S4 += '<hr>\n</BODY>\n</HTML>\n' ; // end of PAGINA.HTML

        var newFN_fp = __dirname + '/public/pagina.html' ;
//        fs.writeFileSync( newFN, S1+S2+S3+S4) => { ; Sync has no callback
        fs.writeFile( newFN_fp, S1+S2+S3+S4, (err) => {

            if (err) throw err ;
            mConsole( '+++ (b2) file ' + newFN_fp + ' has been saved!' ) ;

// (b3)
            var oldFN = './public/pagina.html' ;
            mConsole( '-(b3) delete ' + oldFN ) ;

//            fs.unlink( oldFN, (err) => {
//
//                if (err) {
//                    if ( err.code === 'ENOENT' ) {
//                        console.error( '--- (b3) file ' + oldFN + ' does not exist' ) ;
//                    } else {
//                        throw err ; // fatal error : stop
//                    } ;
//                } else {
//                    mConsole( '+++ (b3) successfully deleted ' + oldFN ) ;
//                } ;

// (b4)
                var newFN = './public/pagina.html' ;
                var oldFN = './public/pagina.nova' ;
                mConsole( '-(b4) rename ' + oldFN + ' as ' + newFN ) ;

//                fs.rename( oldFN, newFN, (err) => {
//
//                    if (err) throw err ;
//                    mConsole( '+++ (b4) renamed complete ' + newFN ) ;
//                } ) ; // rename()
//
//            } ) ; // synch delete "pagina.html"

        } ) ; // write "pagina.nova"

//    } ) ; // synch delete "pagina.nova"

} ; // myTimeout_Gen_HTML_Function()


// funcio per llegir les dades dels socis del fitxer "fitxer_entrada"
// es crida 2 cops : una en engegar el programa, l'altre amb el SIGHUP

function llegir_JSON( fitxer_entrada ) {

  fs.readFile( fitxer_entrada, 'utf8', function ( err, dadesJSON ) {

    if ( err ) throw err ;

    console.dir( "in" + dadesJSON ) ;
    dades_socis = JSON.parse( dadesJSON ) ;
    iNumSocis = dades_socis.length ;        // set var for this run

    dades_socis.forEach( function ( soci, index ) {

        dades_socis [index].estatus   = '+' ; // create new fields ...
        dades_socis [index].timestamp = ' ' ; // ... that are calculated by program, 
        dades_socis [index].count     = 0 ;   // ... not initial or constant values
 
        mConsole( "Index " + index + "/" + iNumSocis + " has" ) ;
        mConsole( "\tout.user      \t"   + dades_socis [index].user ) ;
        mConsole( "\tout.ip        \t"   + dades_socis [index].ip ) ;
        mConsole( "\tout.lnk       \t"   + dades_socis [index].lnk ) ;
        mConsole( "\tout.status    \t"   + dades_socis [index].estatus ) ;
        mConsole( "\tout.timestamp \t"   + dades_socis [index].timestamp ) ;

    } ) ; // forEach()

  } ) ; // readFile()

} ; // llegir_JSON()

// read configuration file at startup

  llegir_JSON( fitxer_entrada ) ;


// set 2 repetitive timeouts

//    console.log( "set TO html, timestamp" + (new Date).hhmmss() ) ;
    setInterval( myTimeout_Gen_HTML_Function, app.get( 'cfgLapse_Gen_HTML' ) ) ; // lets call own function every defined lapse

//    console.log( "set TO ping, timestamp" + (new Date).hhmmss() ) ;
//    setInterval( myTimeout_Do_Ping_Function, app.get( 'cfgLapse_Do_Ping' ) ) ;   //
//    setInterval( myTimeout_Do_Wget_Function, app.get( 'cfgLapse_Do_Ping' ) ) ;   //
//    setInterval( myTimeout_Do_Request_Function, app.get( 'cfgLapse_Do_Ping' ) ) ;   //
    setInterval( myTimeout_Do_SuperAgent_Function, app.get( 'cfgLapse_Do_Ping' ) ) ;   //


// Write an initial message into console.

	var szOut = "+++ +++ +++ +++ TIMER app starts. Versio["+myVersio+"], " ;
        szOut += "HN["+app.get('appHostname')+"], TimeStamp["+genTimeStamp()+"]." ;

	mConsole( szOut ) ;

// implement branches answering the client requests

// (1) if customer asks for "events", we send list from Bitacora

app.get( '/events', function ( req, res ) {

    mConsole( ">>> got /EVENTS." ) ;

    var texte = "<HTML>\n<HEAD>\n" ;
    texte += '<LINK REL=STYLESHEET HREF="pagina.css" TYPE="text/css">\n' ;
    texte += '<TITLE>' + 'Events at ' + genTimeStamp() + '</TITLE>\n' ;
    texte += '</HEAD>\n<BODY>\n' ;
    texte += "<hr>\n<h1>Darrers events dels nodes (last event on top)</h1>\n<hr>\n" ;
//    texte += '<div class="txt_ajuda" style="font-family: Lucida Console">' ;
    texte += '<div class="txt_ajuda" style="font-family: Courier New">' ;
    texte += Listar_Bitacora() ;
    texte += '</div>\n<hr>\n' ;
    texte += '<table class="t_peu"><tr>\n' ;
    texte += '<td>Tornar a la pagina <a href="./inici.html">principal</a> | <a href="./pagina.html">estat antenes</a>\n' ;
    texte += '<td>Versio [' + myVersio + '] at host {' + app.get('appHostname') + '}.\n' ;
    texte += '</table><hr>\n' ;
    texte += '</BODY>\n</HTML>\n' ; // end of EVENTS.HTML

//     console.log( ">>> Send : " + texte ) ;

    res.writeHead( 200, { 'Content-Type': 'text/html' } ) ; // write HTTP headers 
    res.write( texte ) ;
    res.end( ) ;

} ) ; // get '/events'

// (2) if customer asks for "root" page, we display the inital page

app.get( '/', function (req, res) {

    szTraza = ">>> got /, root. Send INICI.HTML " ;
    mConsole( szTraza )
    res.sendFile( __dirname + '/public/inici.html' ) ;

}) ; // get "/"


// start server

var listener = app.listen( app.get( 'cfgPort' ), function () {
    szTraza = '(in) app listening on port (' + listener.address().port + ').' ;
    mConsole( szTraza ) ;
}).on( 'error', function( err ) {
    if ( err.errno === 'EADDRINUSE' ) { // catch port in use error
        console.error( '--- port (' + app.listen( app.get( 'cfgPort' ) + ') busy, process.exit() ---' ) ) ;
        process.exit() ;
    } else {
        console.log( err ) ;
    } ;
} ) ; // app.listen

// szTraza = '(out) APP listening at port (' + app.get( 'cfgPort' ) + ').' ;
// mConsole( szTraza ) ;

