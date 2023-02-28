/**
* @swagger
* tags:
*   name: Post
*   description: The Posts API
*/

import express from 'express'
const router = express.Router()
import post from '../controllers/post'
import auth from '../controllers/auth'

/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - text
*         - image
*         - userId
*       properties:
*         text:
*           type: string
*           description: The post text
*         image:
*           type: string
*           description: The post image
*         userId:
*           type: string
*           description: The owner of the post
*       example:
*         text: 'this is my new post'
*         image: 'localhost::3000//asdasdas'
*         userId: 'lkasjdi23o...'
*/

/**
 * @swagger
 * /post:
 *   get:
 *     summary: get all posts
 *     tags: [Post]
 *     security:
 *       - bearerAuth: [JWT Token]
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *           description: filter the posts according to the given sender id
 *     responses:
 *       200:
 *         description: the list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/Post'
 *  
 */
router.get('/', auth.authenticateMiddleware, post.getAllPosts)

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: get one post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: [JWT Token]
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the file name as it will be saved
 *     responses:
 *       200:
 *         description: the file path
 *         content:
 *           application/json:
 *  
 */
router.get('/:id', auth.authenticateMiddleware, post.getPostById)

/**
 * @swagger
 * /post/add-post:
 *   post:
 *     summary: add a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: [JWT Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *  
 */
router.post('/add-post', auth.authenticateMiddleware, post.addNewPost)

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: update existing post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: [JWT Token]
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the updated post id    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *  
 */
router.put('/:id', auth.authenticateMiddleware, post.updatePostById)

export = router