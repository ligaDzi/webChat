const Koa = require('koa')
const app = new Koa()
const server = require("http").createServer(app.callback())

const config = require('config')

app.keys = [config.get('appSecret')]

const path = require('path')
const fs = require('fs')


// Здесь подключаються модули из папки handlers.
const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort()
handlers.forEach(handler => require('./handlers/' + handler).init(app, dirName = __dirname, server))


// Routing
const Router = require('koa-router')
const router = new Router()

const authRouter = require('./routers/auth')

router.use('/api/auth', authRouter.routes(), authRouter.allowedMethods())



app
    .use(router.routes())
    .use(router.allowedMethods())

    

const PORT = process.env.PORT || config.get('port')
server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

