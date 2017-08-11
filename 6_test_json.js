var fs = require('fs') ;
var myfile = './config.json' ;
var mydata ;

fs.readFile( myfile, 'utf8', function ( err, dadesJSON ) {

    if ( err ) throw err ;

    console.dir( "in" + dadesJSON ) ;
    mydata = JSON.parse( dadesJSON ) ;

    mydata.forEach( function (obj, index) {
        console.log( "Index " + index + " has" ) ;
        console.log( "\t out.user \t"   + mydata[index].user ) ;
        console.log( "\t out.IP   \t"   + mydata[index].IP ) ;
        console.log( "\t out.tf   \t"   + mydata[index].tf ) ;
        mydata[index].status = 'ok' ;
    } ) ; // forEach

//    mydata[0].status = 'ok' ;
    console.log( '===================================== final' ) ;
    console.log ( JSON.stringify ( mydata ) ) ;

} ) ;

