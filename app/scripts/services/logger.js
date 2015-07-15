var Config = require('../config');

var Logger = {
    'Error': function(l, v) {
            if (Config.logLevel === "error")
            {
                console.log(l, v);
            }
            
        },
    
    'Info': function(l, v) {
            if (Config.logLevel === "info")
            {
                console.log(l, v);
            }
            
        },
    
    'Debug': function(l, v) {
            if (Config.logLevel === "debug")
            {
                console.log(l, v);
            }
            
        }
    
}

module.exports = Logger;