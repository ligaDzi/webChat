const { Schema, model } = require('../libs/mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 30
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        min: 6,
        max: 255
    },
    password: { 
        type: String, 
        required: true,
        min: 6,
        max: 255 
    }
})

module.exports = model('User', userSchema)