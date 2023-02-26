// @ Parsing requests and more
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import http from 'http';

// @ for .env variables
import dotenv from 'dotenv'

// @ Express
import express from 'express'

// @ DB
import mongoose from "mongoose"

// @ Swagger
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"

// @ Routes
import authRouter from './routes/auth_route.js'
import postRouter from './routes/post_route.js'
import userRouter from './routes/user_route';
import fileRouter from './routes/file_route.js'

// @ utils
import { getUser } from './socket/utils'
import Message from './models/message_model.js';

// @ chat stuff
const socketio = require('socket.io')

const io = socketio(http);

const app = express()
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json());
app.unsubscribe(cookieParser());


if (process.env.NODE_ENV == 'test') {
    dotenv.config({ path: './.testenv' })
} else {
    dotenv.config()
}

mongoose.connect(process.env.DATABASE_URL) //,{useNewUrlParser:true})
const db = mongoose.connection
db.on('error', error => { console.error(error) })

db.once('open', () => { console.log('connected to mongo DB') })

app.use('/public', express.static('public'))

app.use('/uploads', express.static('uploads'))

app.use('/auth', authRouter)

app.use('/post', postRouter)

app.use('/user', userRouter);

app.use('/file', fileRouter)

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('sendMessage', (message, senderId, callback) => {
        const user = getUser(socket.id);
        const msgData = {
            userId: user.id,
            text: message,
        }
        console.log("MsgData", msgData);

        const msg = new Message({ message, sender: user.id });
        msg.save().then(res => {
            io.to().emit('message', res);
            callback();
        })
    })
})

if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2022 REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
            },
            servers: [{ url: "http://localhost:3000", },],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

export = server

