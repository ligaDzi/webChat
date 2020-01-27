const favicon = require('koa-favicon')
const path = require('path')

exports.init = (app, dirName) => app.use(favicon(path.join(dirName, 'client', 'build')))
