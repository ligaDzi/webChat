const serve = require('koa-static')
const path = require('path')

exports.init = (app, dirName) => {    
    if (process.env.NODE_ENV === 'production') {        
        app.use(serve(path.join(dirName, 'client', 'build'))) 
    }
}
