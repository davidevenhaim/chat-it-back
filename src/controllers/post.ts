
import Post from '../models/post_model'
import Users from '../models/user_model';

import { Request, Response } from 'express'



const getAllPostsEvent = async () => {
    try {
        const posts = await Post.find()
        return { status: 'OK', data: posts }
    } catch (err) {
        return { status: 'FAIL', data: "" }
    }
}

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.aggregate(
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
                    }
                }
            ]
        );
        res.status(200).send(posts)
    } catch (err) {
        res.status(400).send({ err: "fail to get posts from db" })
    }
}

const getAllMyPosts = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const user = await Users.findById(userId);
        if (!user) {
            res.status(400).send({ err: "Token invalid. User id doesn't exists" });
        }

        const ids = user.posts

        const posts = await Post.find({
            _id: { $in: ids }
        });

        res.status(200).send(posts)
    } catch (err) {
        res.status(400).send({ err: "fail to get posts from db" })
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const posts = await Post.findById(id);

        res.status(200).send(posts)
    } catch (err) {
        res.status(400).send({ err: "fail to get posts from db" })
    }
}


const addNewPost = async (req: Request, res: Response) => {

    try {
        const { userId, text, image } = req.body;
        const currentUser = await Users.findById(userId);

        if (!currentUser) {
            res.status(400).send({ err: 'Failed to create post - user id does not exists' });
        }

        const post = new Post({
            text,
            image,
            userId: currentUser._id
        });

        const userPosts = currentUser.posts || [];

        userPosts.push(post.id);
        currentUser.posts = userPosts;

        const [newPost] = await Promise.all([post.save(), currentUser.save()]);

        res.status(200).send(newPost);
    } catch (err) {
        console.log(err)
        res.status(400).send({ err: 'fail adding new post to db' + err })
    }
}

const updatePostById = async (req: Request, res: Response) => {
    try {
        const { image, text, userId } = req.body;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);
        if (userId !== post.userId.toString()) {
            return res.status(401).send({ err: "Error, user is not authorized to change this post." });
        }

        post.$set({
            image: image || post.image,
            text: text || post.text,
        });

        await post.save();

        res.status(200).send(post)

    } catch (err) {
        res.status(400).send({ err: 'fail adding new post to db' + err })
    }
}


export = { getAllPosts, getAllMyPosts, addNewPost, getPostById, updatePostById, getAllPostsEvent, }
