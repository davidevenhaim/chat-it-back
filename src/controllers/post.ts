
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
        let posts = {}
        if (req.query.sender == null) {
            posts = await Post.find()
        } else {
            posts = await Post.find({ 'sender': req.query.sender })
        }
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
    console.log("Add new post");
    try {
        const { userId, text, image } = req.body;
        console.log(req.body);
        const currentUser = await Users.findById(userId);

        if (!currentUser) {
            res.status(400).send({ err: 'Failed to create post - user id does not exists' });
        }

        const post = new Post({
            text,
            image,
            userId
        });

        const userPosts = currentUser.posts || [];

        userPosts.push(post.id);
        currentUser.posts = userPosts;

        const [newPost] = await Promise.all([post.save(), currentUser.save()]);

        res.status(200).send(newPost);
    } catch (err) {
        res.status(400).send({ err: 'fail adding new post to db' })
    }
}


const updatePostById = async (req: Request, res: Response) => {
    try {
        const { image, text, userId } = req.body;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);

        if (userId !== post.userId) {
            return res.status(401).send({ err: "Error, user is not authorized to change this post." });
        }

        post.$set({
            image: image || post.image,
            text: text || post.text,
        });

        await post.save();

        res.status(200).send(post)

    } catch (err) {
        console.log("fail to update post in db")
        res.status(400).send({ err: 'fail adding new post to db' })
    }
}


export = { getAllPosts, getAllMyPosts, addNewPost, getPostById, updatePostById, getAllPostsEvent, }
