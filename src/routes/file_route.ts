import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

import multer from 'multer'

const base = "http://192.168.1.38:3000/"
const storage = multer.diskStorage({
    destination: function (req: Request, file: unknown, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const { id } = req.params;
        cb(null, String(id) + '.jpg') //Appending .jpg
    }
})

const upload = multer({ storage: storage });



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
*       description: The File save API
*/


/**
 * @swagger
 * /file/upload/{id}:
 *   post:
 *     summary: add new file and name it as the given id
 *     tags: [File]
 *     security:
 *       - bearerAuth: [JWT Token]
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: The id of the post/user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               imageUrl:
 *                 type: string
 *                 description: The image url - contains the id as name
 *             example:
 *               imageUrl: 'my.image.url/uploads'
 *  
 */
router.post('/upload/:id', upload.single("file"), function (req: Request, res: Response) {
    res.status(200).send({ url: base + req.file.path })
});


export = router