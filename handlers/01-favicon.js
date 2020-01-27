const favicon = require('koa-favicon')

exports.init = (app, dirName) => app.use(favicon())
