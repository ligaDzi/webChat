const jwt = require('jsonwebtoken')
const config = require('config')


//ЕСТЬ ЛИ У ПОЛЬЗОВАТЕЛЯ ПРАВО НА ПРОСМОТР ЗАКРЫТЫХ СТРАНИЦ ДЛЯ НЕ ЗАРЕГИСТРИРОВАННЫХ ПОЛЗОВАТЕЛЕЙ
//Т.Е. ДЛЯ ПОЛЬЗОВАТЕЛЕЙ КОТОРЫЕ НЕ ВОШЛИ НА САЙТ

module.exports = async (ctx, next) => {
    if (ctx.method === 'OPTIONS') {
        return next()
    }
    
    const { token } = ctx.session

    if (!token) {
        ctx.status = 401
        return ctx.body = { message: 'Доступ запрещен' }
    }

    try {
        const verified = jwt.verify(token, config.get('jwtSecret'))
        
        //В verified БУДЕТ ХРАНИТЬСЯ ID ВОШЕДШЕГО ПОЛЬЗОВАТЕЛЯ
        //ЭТО ПОТОМУ ЧТО МЫ ТАК НАСТРОИЛИ НАШ TOKEN ( смотри файл auth.js маршрут "/login" ).
        //МЫ ПЕРЕДАЕМ ID ПОЛЬЗОВАТЕЛЯ В req.user ДЛЯ УДОБСТВА
        //Т.К. ПО ID ПОЛЬЗОВАТЕЛЯ МОЖНО ПОЛУЧИТЬ ВСЮ ИНФОРМАЦИЮ ПО ПОЛЬЗОВАТЕЛЮ ИЗ БД В ЛЮБОМ МЕСТЕ ПРОГРАММЫ.
        ctx.user = verified        
        
        next()
        
    } catch (error) {        
        ctx.status = 400
        return ctx.body = { 
            error,
            message: 'Неверный токен' 
        }
    }
}