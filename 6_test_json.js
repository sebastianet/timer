var fs = require('fs');
var myfile = './config.json';
var mydata ;

fs.readFile( myfile, 'utf8', function ( err, dadesJSON ) {

    if ( err ) throw err ;

    console.dir( "in" + dadesJSON ) ;
    mydata = JSON.parse( dadesJSON ) ;
    mydata.forEach( function (obj, index) {
        console.log( "Index " + index + " has" ) ;
        console.log( "\tout.user\t"   + mydata[index].user ) ;
        console.log( "\tout.IP  \t"   + mydata[index].IP ) ;
        console.log( "\tout.tf  \t"   + mydata[index].tf ) ;
    } ) ;
} ) ;
