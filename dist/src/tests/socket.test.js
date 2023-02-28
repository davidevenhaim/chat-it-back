"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const socket_server_1 = __importDefault(require("../socket_server"));
const userEmail = "David@gmail.com";
const userPassword = "12345";
const userName = "David";
let userId1 = '';
const userEmail2 = "Lucia@gmail.com";
const userPassword2 = "12345";
const userName2 = "Lucia";
let userId2 = '';
let client1;
let client2;
function clientSocketConnect(clientSocket) {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            console.log("clientSocketConnected!!");
            resolve("1");
        });
    });
}
const connectUser = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("connectUser!@#!@");
    const response1 = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName,
    });
    console.log("response1 : ", response1.body);
    const id = response1.body._id;
    const response = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({
        "email": userEmail2,
        "password": userPassword2,
        "name": userName2,
    });
    const accessToken = response.body.accessToken;
    // const socket = Client('http://localhost:' + process.env.PORT || "3000", {
    //     auth: {
    //         token: 'barrer ' + token
    //     }
    // });
    const socket = (0, socket_server_1.default)(app_1.default);
    socket.close();
    yield clientSocketConnect(socket);
    const client = { socket, accessToken, id };
    return client;
});
describe("my awesome project", () => {
    jest.setTimeout(1000 * 20);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        client1 = yield connectUser();
        client2 = yield connectUser();
        console.log("finish beforeAll");
    }));
    afterAll(() => {
        client1.socket.close();
        client2.socket.close();
        app_1.default.close();
        mongoose_1.default.connection.close();
    });
    test("Get new message should work", (done) => {
        client1.socket.once("send_message", (arg) => {
            console.log("send_message", arg);
            expect(arg.msg).toBe('hello');
            done();
        });
        client1.socket.emit("send_message", { message: "Hello", userId: client1.id });
    });
    test("Post get all test", (done) => {
        client1.socket.once('get_messages', (arg) => {
            console.log("on any " + arg);
            expect(arg.status).toBe('OK');
            done();
        });
        console.log(" test post get all");
        client1.socket.emit("get_messages", [{ message: "Hello" }, { message: "Sup mannnn" }]);
    });
    test("Test chat messages", (done) => {
        const message = "hi... test 123";
        client2.socket.once('new-message', (args) => {
            expect(args.userId).toBe(client2.id);
            expect(args.message).toBe(message);
            expect(args.from).toBe(client1.id);
            done();
        });
        client1.socket.emit("send_message", { message: message, userId: client2.id });
    });
});
//# sourceMappingURL=socket.test.js.map