import mongoose, { Schema } from 'mongoose'

const messagechema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    { timestamps: true }
)

export = mongoose.model('Message', messagechema)

