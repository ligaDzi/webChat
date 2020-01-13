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
const roomRouter = require('./routers/rooms')
const userRouter = require('./routers/user')
const messageRouter = require('./routers/message')

router.use('/api/auth', authRouter.routes(), authRouter.allowedMethods())
router.use('/api/room', roomRouter.routes(), roomRouter.allowedMethods())
router.use('/api/user', userRouter.routes(), userRouter.allowedMethods())
router.use('/api/message', messageRouter.routes(), messageRouter.allowedMethods())



app
    .use(router.routes())
    .use(router.allowedMethods())



const PORT = config.get('port')
server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

