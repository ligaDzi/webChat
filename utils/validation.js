const Joi = require('@hapi/joi')

//ВАЛИДАЦИЯ РЕГИСТРАЦИОННЫХ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
const registerValidation = data => {

    const schema = {
        name: Joi.string().max(30).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    }

    return Joi.validate(data, schema)
}

//ВАЛИДАЦИЯ ПОЛЬЗОВАТЕЛЯ ПРИ ВХОДЕ
const loginValidation = data => {

    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    }

    return Joi.validate(data, schema)
}

//ВАЛИДАЦИЯ СОЗДАНИЯ НОВОЙ КОМНАТЫ В ЧАТЕ
const createRoomValidation = data => {

    const schema = {
        name: Joi.string().max(30).required()
    }

    return Joi.validate(data, schema)
}

//ВАЛИДАЦИЯ ДОБАВЛЕНИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ В ЧАТ-КОМНАТУ
const addAndDelUserInRoomValidation = data => {

    const schema = {
        userId: Joi.string().required(),
        roomId: Joi.string().required()
    }

    return Joi.validate(data, schema)
}

//ВАЛИДАЦИЯ ДОБАВЛЕНИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ В ЧАТ-КОМНАТУ
const addMessageInRoomValidation = data => {

    const schema = {
        username: Joi.string().max(30).required(), 
        text: Joi.string().min(1).max(1024).required(), 
        userId: Joi.string().required(),
        roomId: Joi.string().required()
    }

    return Joi.validate(data, schema)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.createRoomValidation = createRoomValidation
module.exports.addAndDelUserInRoomValidation = addAndDelUserInRoomValidation
module.exports.addMessageInRoomValidation = addMessageInRoomValidation