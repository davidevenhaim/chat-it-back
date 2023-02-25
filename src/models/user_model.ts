import mongoose, { Schema } from 'mongoose'

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
            type: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
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

