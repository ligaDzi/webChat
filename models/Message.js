const { Schema, model, Types } = require('../libs/mongoose')

const messageSchema = new Schema({
    username: {
        type: String,
        required: true,
        max: 30
    },
    text: {
        type: String,
        required: true,
        min: 1,
        max: 1024
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User' 
    },
    roomId: {
        type: Types.ObjectId,
        ref: 'Room' 
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Message', messageSchema)