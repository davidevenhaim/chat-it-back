"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const base = "http://192.168.1.38:3000/";
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const { id } = req.params;
        cb(null, String(id) + '.jpg'); //Appending .jpg
    }
});
const upload = (0, multer_1.default)({ storage: storage });
/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/
/**
* @swagger
* tags:
*       name: File
*       description: The File save APIii
*/
/**
* @swagger
* components:
*   schemas:
*     Message:
*       type: object
*       required:
*         - message
*         - userId
*       properties:
*         message:
*           type: string
*           description: The message content
*         userId:
*           type: string
*           description: The message send id
*       example:
*         message: 'hello world'
*         userId: 'kasjhd823dkas....'
*/
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
router.post('/upload/:id', upload.single("file"), function (req, res) {
    res.status(200).send({ url: base + req.file.path });
});
module.exports = router;
//# sourceMappingURL=file_route.js.map