const session = require('koa-session');


exports.init = app => app.use(session({}, app));
