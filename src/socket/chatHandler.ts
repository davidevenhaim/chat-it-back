
import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { saveMessage, getAllMessages } from "../controllers/message"

export = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {

    const sendMessage = async (data: { message: string, userId: string }) => {
        if (!data) return;
        const { message, userId } = data;
        const res = await saveMessage(message, userId);
        io.emit("new-message", res.data);
    }

    const getMessages = async (data: { roomId: string }) => {
        const res = await getAllMessages();
        if (!data) {
            io.emit("res_messages", res.data);
            return;
        }
        const { roomId } = data;

        if (roomId) {
            io.to(roomId).emit("res_messages", res.data);
        } else {
            io.emit("res_messages", res.data);
        }
    }

    socket.on("send_message", sendMessage)
    socket.on("get_messages", getMessages)
}
