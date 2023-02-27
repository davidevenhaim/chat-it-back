import mongoose, { Schema } from 'mongoose'
import Message from '../models/message_model'
import Users from '../models/user_model'


const getAllMessages = async () => {
    try {
        const messages = await Message.aggregate(
            [
                { $unwind: "$userId" },
                {
                    $lookup: {
                        from: Users.collection.name,
                        localField: "userId",
                        foreignField: "_id",
                        as: "owner"
                    }
                },
                { $unwind: '$owner' },
                {
                    $project: {
                        "owner.password": 0,
                        "owner.posts": 0,
                        "owner.createdAt": 0,
                        "owner.refresh_tokens": 0,
                        "owner.updatedAt": 0,
                        "owner.__v": 0,
                        "_id": 0,
                        "email": 0
                    }
                }
            ]
        );
        return { status: "OK", data: messages }
    } catch (err) {
        return { status: "FAIL", data: "" }
    }
}

const saveMessage = async (message: string, userId: string) => {
    try {
        const msg = new Message({
            message,
            userId: new mongoose.Types.ObjectId(userId),
        });

        await msg.save();

        const dbMsg = await Message.aggregate(
            [
                { $match: { _id: msg._id } },
                { $unwind: "$userId" },
                {
                    $lookup: {
                        from: Users.collection.name,
                        localField: "userId",
                        foreignField: "_id",
                        as: "owner"
                    }
                },
                { $unwind: '$owner' },
                {
                    $project: {
                        "owner.password": 0,
                        "owner.posts": 0,
                        "owner.createdAt": 0,
                        "owner.refresh_tokens": 0,
                        "owner.updatedAt": 0,
                        "owner.__v": 0,
                        "_id": 0,
                        "email": 0
                    }
                }
            ]
        );

        return { status: "OK", data: dbMsg[0] };
    } catch (err) {

        return { status: "FAIL", data: err }
    }
}

export { getAllMessages, saveMessage };