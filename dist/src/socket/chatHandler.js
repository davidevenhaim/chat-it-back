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
const message_1 = require("../controllers/message");
module.exports = (io, socket) => {
    const sendMessage = (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!data)
            return;
        const { message, userId } = data;
        const res = yield (0, message_1.saveMessage)(message, userId);
        io.emit("new-message", res.data);
    });
    const getMessages = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, message_1.getAllMessages)();
        if (!data) {
            console.log("!Data");
            io.emit("res_messages", res.data);
            return;
        }
        const { roomId } = data;
        if (roomId) {
            io.to(roomId).emit("res_messages", res.data);
        }
        else {
            io.emit("res_messages", res.data);
        }
    });
    console.log('register chat handlers');
    socket.on("send_message", sendMessage);
    socket.on("get_messages", getMessages);
};
//# sourceMappingURL=chatHandler.js.map