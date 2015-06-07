var Marty = require('marty');


// Add hooks for all HttpStateSources
Marty.HttpStateSource.addHook({
   id: 'CORS',
   priority: 1,
   before(req) {
       req.headers['Access-Control-Allow-Origin'] = '*';
   }
});

Marty.HttpStateSource.addHook({
   id: 'JWT',
   priority: 2,
   before(req) {
       req.headers['Authorization'] = 'QWRJKLFDJKSL.FJKLDJKLFDJKL.BURKE.HS256';
   }
});

Marty.HttpStateSource.addHook({
   id: 'JSON',
   priority: 3,
   after(res) {
       return res.json();
   }
});

var { UserStore, UserQueries, UserAPI } = require('./userstore');

class Application extends Marty.Application {
    constructor(options) {
        super(options);
        
        this.register('UserStore', UserStore);
        this.register('UserQueries', UserQueries);
        this.register('UserAPI', UserAPI);
    }
}

module.exports = Application;