"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true,
        default: ''
    },
    email: {
        type: String,
        required: true
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
        type: [String]
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user_model.js.map