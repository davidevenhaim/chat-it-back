require('dotenv').config();

import server from "../app"
import mongoose from "mongoose"
import request from 'supertest'

// @ Chat stuff
import Client, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

// @ Models
import Message from "../models/message_model";
import User from '../models/user_model'

const userEmail = "David@gmail.com"
const userPassword = "12345"
const userName = "David"
let userId1 = ''

const userEmail2 = "Lucia@gmail.com"
const userPassword2 = "12345"
const userName2 = "Lucia"
let userId2 = ''

type Client = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    accessToken: string,
    id: string
}

let client1: Client
let client2: Client

function clientSocketConnect(clientSocket): Promise<string> {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            console.log("clientSocketConnected!!");
            resolve("1");
        });
    })
}

const connectUser = async () => {
    console.log("connectUser!@#!@")
    const response1 = await request(server).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName,
    })
    console.log("response1 : ", response1.body);
    const userId = response1.body._id

    const response = await request(server).post('/auth/login').send({
        "email": userEmail2,
        "password": userPassword2,
        "name": userName2,
    });

    const token = response.body.accessToken

    const socket = Client('http://localhost:' + process.env.PORT || "3000", {
        auth: {
            token: 'barrer ' + token
        }
    });

    await clientSocketConnect(socket)
    const client = { socket: socket, accessToken: token, id: userId }
    return client;
}

describe("my awesome project", () => {
    jest.setTimeout(1000 * 20)

    beforeAll(async () => {
        await Message.remove();
        await User.remove();
        console.log("@@@@@@@@@@@@@@@@@ res yet to be defined")
        const res = await connectUser();
        console.log("@@@@@@@@@@@@@@@@@ res", res)
        client1 = res;
        client2 = await connectUser()
        console.log("finish beforeAll")
    });

    afterAll(() => {
        client1.socket.close()
        client2.socket.close()
        server.close()
        mongoose.connection.close()
    });

    test("Get new message should work", (done) => {
        client1.socket.once("send_message", (arg) => {
            console.log("send_message", arg);
            expect(arg.msg).toBe('hello');
            done();
        });
        client1.socket.emit("send_message", { message: "Hello", userId: client1.id })
    });


    test("Post get all test", (done) => {
        client1.socket.once('get_messages', (arg) => {
            console.log("on any " + arg)
            expect(arg.status).toBe('OK');
            done();
        });
        console.log(" test post get all")
        client1.socket.emit("get_messages", [{ message: "Hello" }, { message: "Sup mannnn" }])
    });


    test("Test chat messages", (done) => {
        const message = "hi... test 123"
        client2.socket.once('new-message', (args) => {
            expect(args.userId).toBe(client2.id)
            expect(args.message).toBe(message)
            expect(args.from).toBe(client1.id)
            done()
        })
        client1.socket.emit("send_message", { message: message, userId: client2.id })
    })
});
