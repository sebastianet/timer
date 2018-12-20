//
// prova del WGET, parametres, etc
//
// install as      npm install -g node-wget
// package         https://www.npmjs.com/package/node-wget
//                 https://nodejs.org/api/os.html#os_os_networkinterfaces
// run it as       (sudo) node 7_test_wget.js
// on browser do   inet   : http://192.168.1.123:7001/fer_wget  (ODIN server)
//                 guifi  : http://10.139.238.194:7001/fer_wget (POMNIA server)
//                 http://10.139.238.194:7001/fer_wget/target_ip=AAA.BBB.CCC.DDD
//                 as http://10.139.238.194:7001/fer_wget/target_ip=10.139.238.33

// few modules we need

var express = require( 'express' ) ;
var app     = express() ;

var os      = require( 'os' ) ;
var wget    = require( 'node-wget' ) ;

// few vars we use

var
//      szTargetIP = 'http://10.139.130.65' ;  // Campanar ST1
// szTargetIP = 'http://10.139.130.129' ; // Tabor ST1-AP1
szTargetIP = 'http://10.139.238.1' ; // Tabor ST1-AP3

    app.set( 'cfgPort', process.env.PORT || 7001 ) ;
    app.set( 'cfgLapse', 5900 ) ;

// display own IP

var interfaces = os.networkInterfaces() ;
var addresses = [] ;
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2] ;
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address) ;
        }
    }
}

var szMyIP = addresses[1] ;
console.log( "### my IP is [", szMyIP, "]" ) ;

// calculate user's URL to access this server

var szMyURL = "http://" + szMyIP + ":" + app.get( 'cfgPort' ) + "/fer_wget/target_ip=AAA.BBB.CCC.DDD" ;

// +++ set express branch for client request
// rebem GET /fer_wget/target_ip=AAA.BBB.CCC.DDD
app.get( '/fer_wget/target_ip=:usr_sel_ip', function (req, res) {

// modify szTargetIP from user selection
    var szUserIP = req.params.usr_sel_ip ; 
    console.log( '>>> >>> >>> >>> >>> >>> user selection (' + szUserIP + ')' );

    if ( szUserIP.length > 0 ) {
        szTargetIP = 'http://' + szUserIP ;
    } ;

// display final value

    console.log( '>>> >>> >>> >>> >>> >>> get /fer_wget ' + szTargetIP );

    wget( {
            url:  szTargetIP,   // 'https://raw.github.com/angleman/wgetjs/master/package.json',
            dest: '/tmp/',      // destination path or path with filename, default is ./
            timeout: 2000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
        },
        function (error, response, body) {

            var currentdate = new Date();
            var datetime = "Last Sync: " + currentdate.getDate() + "/"
                         + (currentdate.getMonth()+1)  + "/"
                         + currentdate.getFullYear() + " @ "
                         + currentdate.getHours() + ":"
                         + currentdate.getMinutes() + ":"
                         + currentdate.getSeconds();

            var szTexte = "<hr>" ;

            if (error) {

                console.log('--- error:');
                console.log(error);            // error encountered

                szTexte += "--- Hello from 7_test_wget.js (" + datetime + ') - ['+ error + '] ---' ;

            } else {

                console.log('--- headers:');
                console.log( response.headers ) ; // response headers
                console.log('--- body:');
//                console.log( body ) ;             // content of package

                var iH1s = body.search( /<h1>/i ) ;  // start of H1 header, case insensitive
                var iH1e = 0 ;
                if ( iH1s > 0 ) {
                    iH1e = body.toLowerCase().indexOf( "</h1>" ) ; // end of H1 header
                } ;

                szTexte += "+++ Hello from 7_test_wget.js (" + datetime + ') +++' ;
                szTexte += "<p>IP {" + szTargetIP + "} accessed OK" ;
                szTexte += "<p>H1 start found at {" + iH1s.toString() + "}." ;
                szTexte += "<p>H1 end found at {" + iH1e.toString() + "}." ;

                var iH1l = 0 ; 
                if ( iH1e > iH1s ) {
                    iH1l = iH1e - iH1s ; // H1 length
                    var szMyH1 = body.substring( iH1s +4, iH1e ) ;
                    szTexte += "<p>H1 is {" + szMyH1 + "}." ;
                } ;
            }

            szTexte += "<hr>" ;
            res.writeHead( 200, { 'Content-Type': 'text/html' } ) ;
            res.write( szTexte ) ;
            res.end( ) ;
        }
    ) ; // wget()

} ) ; // app.get()


// start server

var listener = app.listen( app.get( 'cfgPort' ), function () {
    console.log( '(in) app listening on port', listener.address().port )
})

// console.log( '(out) APP listening at port', app.get( 'cfgPort' ) ) ;
console.log( '### do [' + szMyURL + '] to access 7_test_wget.js' ) ;

