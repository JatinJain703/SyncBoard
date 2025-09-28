import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
import jwt, { type JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv";
import { RoomManager } from "./RoomManager.js";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
import mongoose from "mongoose";
import { UserModel } from "../../shared/dist/db.js";
const mongourl = process.env.mongourl!;
mongoose.connect(mongourl);

const roomManager = new RoomManager();

wss.on("connection", async (ws, Request) => {
  const url = Request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || " ";
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    ws.close();
    return;
  }

  if (!decoded) {
    ws.close();
    return;
  }
  const user = await UserModel.findById(decoded.id);
  roomManager.addUser(ws, decoded.id, user?.name || "");
})