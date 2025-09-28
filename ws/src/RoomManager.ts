import type { ObjectId } from "mongoose";
import WebSocket from "ws";
import { CHAT, JOIN_ROOM, LEAVE_ROOM } from "./messages.js";
import { RoomModel } from "../../shared/dist/db.js";
interface User {
    socket: WebSocket,
    userid: ObjectId,
    username: String,
    Room: String | null
}

export class RoomManager {
    private Users: User[];

    constructor() {
        this.Users = [];
    }

    private addhandler(socket: WebSocket) {
        socket.on("message", async (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === JOIN_ROOM) {
                const user = this.Users.find(u => u.socket === socket);
                if (!user) {
                    return;
                }
                const Room = await RoomModel.findById(message.Roomid);
                if (Room) {
                    user.Room = message.Roomid;
                    this.broadcastMembers(message.Roomid, Room?.hostid?.toString() || "");
                }

                else {
                    user.socket.send(JSON.stringify({
                        message: "Room does not exist"
                    }))
                }
            }
            if (message.type === LEAVE_ROOM) {
                const user = this.Users.find(u => u.socket === socket);
               
                if (!user) { return;}
                this.removeUser(socket);
                const Room = await RoomModel.findById(message.Roomid);
                if (Room) {
                    this.broadcastMembers(message.Roomid, Room?.hostid?.toString() || "");
                }
                else {
                    user.socket.send(JSON.stringify({ message: "Room does not exist" }))
                }

            }
            if (message.type === CHAT) {
                const user = this.Users.find(u => u.socket === socket);
                if (!user) {
                    return;
                }
                if (user.Room !== message.Roomid) {
                    socket.send(JSON.stringify({
                        type: "ERROR",
                        message: "You are not part of this room"
                    }));
                    return;
                }
                try {
                    const Room = await RoomModel.findById(message.Roomid);
                    Room?.chat.push({
                        userid: user.userid,
                        message: message.chat
                    })

                    this.Users.forEach(u => {
                        if (u.Room === message.Roomid) {
                            u.socket.send(JSON.stringify({
                                type: CHAT,
                                Roomid: message.Roomid,
                                from: user.userid,
                                chat: message.chat,
                                timestamp: Date.now()
                            }));
                        }
                    });
                    await Room?.save();
                } catch (err) {
                    user.socket.send(JSON.stringify({
                        type: "error",
                        message: "Unable to Chat"
                    }))
                }
            }
        })
    }
    private broadcastMembers(roomId: string, hostId: String) {
        const members = this.Users
            .filter(u => u.Room === roomId)
            .map(u => ({
                userid: u.userid,
                username: u.username
            }));
        console.log(members);
        this.Users.forEach(u => {
            if (u.Room === roomId) {
                u.socket.send(JSON.stringify({
                    type: "MEMBERS",
                    Roomid: roomId,
                    host: hostId,
                    members: members
                }));
            }
        });
    }

    addUser(socket: WebSocket, userid: ObjectId, username: String) {
        const temp = this.Users.find(u => u.userid === userid && u.socket === socket)
        if (temp) {
            return;
        }

        this.Users.push({
            socket: socket,
            userid: userid,
            username: username,
            Room: null
        })

        this.addhandler(socket);
    }
    removeUser(socket: WebSocket) {
        this.Users = this.Users.filter(u => u.socket !== socket);
    }

}