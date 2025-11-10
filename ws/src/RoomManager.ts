import type { ObjectId } from "mongoose";
import WebSocket from "ws";
import { CHAT, JOIN_ROOM, LEAVE_ROOM, SNAPSHOT, PATCH} from "./messages.js";
import { RoomModel } from "./db.js";
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
                    this.broadcastMembers(message.Roomid, Room?.hostid?.toString() || "",user.userid,"new-user");
                }

                else {
                    user.socket.send(JSON.stringify({
                        message: "Room does not exist"
                    }))
                }
            }
            if (message.type === LEAVE_ROOM) {
                const user = this.Users.find(u => u.socket === socket);

                if (!user) { return; }
                this.removeUser(socket);
                const Room = await RoomModel.findById(message.Roomid);
                if (Room) {
                    this.broadcastMembers(message.Roomid, Room?.hostid?.toString() || "",user.userid,"user-left");
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
            if (message.type === SNAPSHOT) {
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
                    if (!Room) {
                        return;
                    }
                    let snapshot = message.snapshot;

                    if (typeof snapshot === "string") {
                        try {
                            snapshot = JSON.parse(snapshot);
                        } catch (err) {
                            console.error("Invalid snapshot string:", err);
                            return; // skip saving
                        }
                    }

                    if (snapshot && typeof snapshot === "object") {
                        Room.editorState = snapshot;
                        await Room.save();
                    }

                } catch (err) {
                    console.error("Error saving snapshot:", err);
                }
            }
            if (message.type === PATCH) {
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
                this.Users.forEach(u => {
                    if (u.Room === message.Roomid && u.socket !== socket) {
                        u.socket.send(JSON.stringify({
                            type: "PATCH",
                            from: user.userid,
                            patches: Array.isArray(message.patches) ? message.patches : [message.patches]
                        }));
                    }
                });
            }
        })
    }
    private broadcastMembers(roomId: string, hostId: String,userId:ObjectId,msg:string) {
        const members = this.Users
            .filter(u => u.Room === roomId)
            .map(u => ({
                userid: u.userid.toString(),
                username:u.username
            }));
            const usersocket=this.Users.find(u=>u.userid===userId)?.socket;
        this.Users.forEach(u => {
            if (u.Room === roomId) {
                
                 const personalizedMembers = members.map(m => ({
                ...m,
                username: m.userid === u.userid.toString() ? "You" : m.username
            }));
                u.socket.send(JSON.stringify({
                    type: "MEMBERS",
                    Roomid: roomId,
                    host: hostId,
                    members: personalizedMembers
                })); 
                if(u.socket!==usersocket)
                {
                  u.socket.send(JSON.stringify({
                    type:msg,
                    userId:userId.toString()
                  }))
                }
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