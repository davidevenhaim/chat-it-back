/**
* @swagger
* tags:
*   name: File
*   description: Files upload
*/

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
 * /post:
 *   get:
 *     summary: Upload file to the server
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
 *         description: upload file by id - post or user!
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/Post'
 *                  $ref: '#/components/schemas/User'
 *  
 */
router.post('/upload/:id', upload.single("file"), function (req: Request, res: Response) {
    res.status(200).send({ url: base + req.file.path })
});


export = router