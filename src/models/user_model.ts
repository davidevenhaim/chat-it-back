import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        avatarUrl: {
            type: String,
            required: false,
            default: ''
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        posts: {
            type: [String],
            required: true,
            default: []
        },
        refresh_tokens: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
)

export = mongoose.model('User', userSchema)

