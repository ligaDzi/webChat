const Router = require('koa-router')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const mongoose = require('../libs/mongoose')
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../utils/validation')

const router = new Router()


//АВТОМАТИЧЕСКИЙ ВХОД НА САЙТ, ЕСЛИ В СЕССИИ СОХРАНЕН ТОКЕН
router.get('/autoenter', async (ctx, next) => {
    const { token } = ctx.session

    if (token) {
        const userId = jwt.verify(token, config.get('jwtSecret')) 
        const user = await User.findById(userId)
            
        ctx.status = 201
        return ctx.body = { 
            message: 'Пользователь вошел на сайт',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
    } else {
        return ctx.body = { message: 'Пользователь не вошел на сайт' }
    }
})

//ВЫХОД С УЧЕТНОЙ ЗАПИСИ ПОЛЬЗОВАТЕЛЯ
router.get('/logout', async (ctx, next) => {
    ctx.session.token = null
    ctx.redirect('/')
})

//РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
router.post('/register', async (ctx, next) => {
    
    try {
        //ВАЛИДАЦИЯ
        const { error } = registerValidation(ctx.request.body)
        if (error) {
            ctx.status = 400
            return ctx.body = { 
                error: error.details[0].message,
                message: 'Некорректные данные при регистрации.'
            }
        }
    
        const { name, email, password } = ctx.request.body
    
        //ПРОВЕРЯЕМ ЕСТЬ ЛИ ПОЛЬЗОВАТЕЛЬ УЖЕ В БД
        const emailExists = await User.findOne({ email })
        if(emailExists){
            ctx.status = 400
            return ctx.body = { message: 'Такой пользователь уже существует' }
        }
    
        //ХЭШИРОВАНИЕ ПАРОЛЯ С ИСПОЛЬЗОВАНИЕМ МОДУЛЯ "bcryptjs"
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt) 
    
        //РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        user.save()
                
        //ЗДЕСЬ СДЕЛАТЬ РЕДИРЕКТ ПО АДРЕССУ "/login" ЧТОБЫ ПОЛЬЗОВАТЕЛЬ ПОСЛЕ РЕГИСТРАЦИИ СРАЗУ ВХОДИЛ НА САЙТ
        const token = jwt.sign( 
            { _id: user._id }, 
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )

        ctx.session.token = token
    
        ctx.status = 201
        return ctx.body = { 
            message: 'Пользователь создан',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
        
    } catch (err) {        
        ctx.status = 500
        return ctx.body = { 
            error: err, 
            message: 'Что-то пошло не так, плпробуйте снова.' 
        }        
    }
})

//ВХОД ПОЛЬЗОВАТЕЛЯ
router.post('/login', async (ctx, next) => {
    try {        
        //ВАЛИДАЦИЯ 
        const { error } = loginValidation(ctx.request.body)
        if (error) {
            ctx.status = 400
            return ctx.body = { 
                error: error.details[0].message,
                message: 'Некорректные данные при регистрации.'
            }
        }

        const { email, password } = ctx.request.body

        
        //ПРОВЕРЯЕМ ЕСТЬ ЛИ ПОЛЬЗОВАТЕЛЬ В БД
        const user = await User.findOne({ email })
        if (!user) {
            ctx.status = 400
            return ctx.body = { message: 'Эмеил или пароль ввиден не правильно' }
        }

        //ПРОВЕРЯЕМ ВЕРНЫЙ ЛИ ПАРОЛЬ
        //СРАВНИВАЕМ ВВЕДЕНЫЙ ПАРОЛЬ ПОЛЬЗОВАТЕЛЕМ И ХЭШИРОВАННЫЙ ПАРОЛЬ ХРАНЯЩИЙСЯ В БД
        const isMatch = await bcrypt.compare(password, user.password)
        
        if (!isMatch) {
            ctx.status = 400
            return ctx.body = { message: 'Эмеил или пароль ввиден не правильно' }
        }
        
        //СОЗДАЕМ И ПЕРЕДАЕМ ПОЛЬЗОВАТЕЛЮ  JSON WEB TOKEN
        //ЭТОТ ТОКЕН БУДЕТ ХРАНИТЬСЯ У ПОЛЬЗОВАТЕЛЯ В КУКИ 
        //И ЕМУ БУДЕТ ОТКРЫТ ДОСТУП НА ЗАКРЫТЫЕ СТРАНИЦЫ ДЛЯ НЕ ЗАРЕГИСТРИРОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ 
        const token = await jwt.sign(
            { _id: user._id }, 
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )

        ctx.session.token = token
    
        ctx.status = 201
        return ctx.body = { 
            message: 'Пользователь вошел на сайт',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }

    } catch (err) {
        ctx.status = 500
        return ctx.body = {
            error: err,
            message: 'Что-то пошло не так, попробуйте снова'
        }
    }
})

module.exports = router

