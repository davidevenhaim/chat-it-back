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
import io from "../socket_server";
import { Server } from "socket.io";

const userEmail = "David@gmail.com"
const userPassword = "12345"
const userName = "David"
let userId1 = ''

const userEmail2 = "Lucia@gmail.com"
const userPassword2 = "12345"
const userName2 = "Lucia"
let userId2 = ''

type Client = {
    socket: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    accessToken: string,
    id: string
}

let client1: Client
let client2: Client

function clientSocketConnect(clientSocket): Promise<string> {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            resolve("1");
        });
    })
}

const connectUser = async () => {
    const response1 = await request(server).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName,
    })

    const id = response1.body._id

    const response = await request(server).post('/auth/login').send({
        "email": userEmail2,
        "password": userPassword2,
        "name": userName2,
    });

    const accessToken = response.body.accessToken

    // const socket = Client('http://localhost:' + process.env.PORT || "3000", {
    //     auth: {
    //         token: 'barrer ' + token
    //     }
    // });
    const socket = io(server)
    socket.close()
    await clientSocketConnect(socket)
    const client = { socket, accessToken, id }
    return client;
}

describe("my awesome project", () => {
    jest.setTimeout(1000 * 20)

    beforeAll(async () => {
        client1 = await connectUser();
        client2 = await connectUser()
    });

    afterAll(() => {
        client1.socket.close()
        client2.socket.close()
        server.close()
        mongoose.connection.close()
    });

    test("Get new message should work", (done) => {
        client1.socket.once("send_message", (arg) => {
            expect(arg.msg).toBe('hello');

            done();
        });
        client1.socket.emit("send_message", { message: "Hello", userId: client1.id })
    });


    test("Post get all test", (done) => {
        client1.socket.once('get_messages', (arg) => {
            expect(arg.status).toBe('OK');
            done();
        });

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
