
// prova del PING de PYTHON, parametres, etc
//
// install as    "npm install python-shell"
// run it as     "sudo node 5_test_ping.js"
// on browser do "http://192.168.1.123:4001/fer_ping"


var express = require( 'express' ) ;
var app     = express() ;

var PythonShell = require( 'python-shell' ) ;

    app.set( 'cfgPort', process.env.PORT || 4001 ) ;
    app.set( 'cfgLapse', 5900 ) ;

app.get( '/fer_ping', function (req, res) {

var python_options = {
    mode: 'text',
    pythonPath: '/usr/bin/python',
    pythonOptions: ['-u'],
    scriptPath: '/home/pi/timer',
    args: ['value1', 'value2', 'value3']
} ;

// var szIP = '11.12.13.14' ;
var szIP = '74.125.143.104' ;

    python_options.args[0] = szIP ;
    console.log( '>>> get /fer_ping' );
    PythonShell.run( '2_do_ping.py', python_options, function( err, results ) {
        if ( err ) throw err;
        console.log( '(+) Python results (%j).', results ) ;
// results is an array consisting of messages collected during execution

        var texte = "<hr> PING " + szIP ;
//    var myTS = genTimeStamp() ;
        texte += " : " + results + " <p> <hr>" ;

        console.log( "Send " + texte ) ;

        res.writeHead( 200, { 'Content-Type': 'text/html' } ) ; // write HTTP headers 
        res.write( texte ) ;
        res.end( ) ;
    } ) ; // python shell

} ) ; // fer ping



// start server

var listener = app.listen( app.get( 'cfgPort' ), function () {
    console.log( '(in) app listening on port', listener.address().port )
})

console.log( '(out) APP listening at port', app.get( 'cfgPort' ) ) ;

