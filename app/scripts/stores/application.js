var Marty = require('marty');

var UserConstants = Marty.createConstants([
  'LOGIN_REQUIRED',
]);

// Add hooks for all HttpStateSources
// Marty.HttpStateSource.addHook({
//    id: 'CORS',
//    priority: 1,
//    before(req) {
//        req.headers['Access-Control-Allow-Origin'] = '*';
//    }
// });

Marty.HttpStateSource.addHook({
   id: 'JWT',
   priority: 1,
   before(req) {
       req.headers['Authorization'] = 'QWRJKLFDJKSL.FJKLDJKLFDJKL.BURKE.HS256';
   }
});

// Marty.HttpStateSource.addHook({
//    id: '401',
//    priority: 2,
//    after(res) {
//       if (res.status == 401){
//           console.log("Saw the 401");
//           this.dispatch(UserConstants.LOGIN_REQUIRED);
//           return res;
//       }
//    }
// });

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
