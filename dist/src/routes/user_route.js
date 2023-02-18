"use strict";
/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("../controllers/users"));
const router = express_1.default.Router();
/**
* @swagger
* components:
*   schemas:
*     Student:
*       type: object
*       required:
*         - id
*         - name
*         - avatarUrl
*       properties:
*         id:
*           type: string
*           description: The student id
*         name:
*           type: string
*           description: The student name
*         avatarUrl:
*           type: string
*           description: The student avatar url
*       example:
*         id: '123'
*         name: 'Oren'
*         avatarUrl: 'www.mysute/oren.jpg'
*/
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: get user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 */
router.get('/:id', users_1.default.getUser);
/**
 * @swagger
 * /user/edit-user/{id}:
 *   post:
 *     summary: change user data
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 */
router.post('/edit-user/:id', users_1.default.editUserInfo);
exports.default = router;
//# sourceMappingURL=user_route.js.map