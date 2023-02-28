"use strict";
/**
* @swagger
* tags:
*   name: Post
*   description: The Posts API
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../controllers/post"));
const auth_1 = __importDefault(require("../controllers/auth"));
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
 *     summary: get list of post from server
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
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
router.get('/', auth_1.default.authenticateMiddleware, post_1.default.getAllPosts);
/**
 * @swagger
 * /file/{id}:
 *   post:
 *     summary: upload file and name it by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
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
router.get('/:id', auth_1.default.authenticateMiddleware, post_1.default.getPostById);
/**
 * @swagger
 * /post/add-post:
 *   post:
 *     summary: add a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: [JWT]
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
router.post('/add-post', auth_1.default.authenticateMiddleware, post_1.default.addNewPost);
/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: update existing post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
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
router.put('/:id', auth_1.default.authenticateMiddleware, post_1.default.updatePostById);
module.exports = router;
//# sourceMappingURL=post_route.js.map