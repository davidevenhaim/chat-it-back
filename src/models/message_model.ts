import mongoose from 'mongoose'

const messagechema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
})

export = mongoose.model('Message', messagechema)

