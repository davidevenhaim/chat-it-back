"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
module.exports = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user_model.js.map