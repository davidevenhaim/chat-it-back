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

router.post('/upload/:id', upload.single("file"), function (req: Request, res: Response) {
    res.status(200).send({ url: base + req.file.path })
});


export = router