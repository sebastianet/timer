
app.get( '/fer_ping', function (req, res) {

var python_options = {
    mode: 'text',
    pythonPath: '/usr/bin/python',
    pythonOptions: ['-u'],
    scriptPath: '/home/pi/timer',
    args: ['value1', 'value2', 'value3']
} ;

var szIP = '11.12.13.14' ;

    python_options.args[2] = szIP ;
    console.log( '>>> Hacer ping.' );
    PythonShell.run( '2_do_ping.py', python_options, function( err, results ) {
        if ( err ) throw err;
        console.log( '(+) Python results are (%j).', results ) ;
// results is an array consisting of messages collected during execution
     } ) ;
} ) ; // fer ping

