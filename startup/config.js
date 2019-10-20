const config = require('config');

const debug = require('debug')('app:starting');

module.exports = function() {
    // Configuration
    debug('Application name : ' + config.get('name'));
    debug('Mail Server : ' + config.get('mail.host'));
    //get the pass from environment variable for the mail server password
    // debug('Mail Password : ' + config.get('mail.password'));
        
    
    // set vidly_jwtPrivatekey=blablabla
    if (!config.get('jwtPrivateKey')) {
        console.error('Fatala error the jwtPrivateKey is not defined');
        process.exit(1);
        // 0 means success
        // anything beside 0 is failure
    }

}