const { Schema, model, Types } = require('../libs/mongoose')

const roomSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        max: 30
    },
    users: [{ 
        type: Types.ObjectId,
        ref: 'User' 
    }],
    messages: [{ 
        type: Types.ObjectId,
        ref: 'Message' 
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Room', roomSchema)