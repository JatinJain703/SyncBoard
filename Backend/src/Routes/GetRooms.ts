import express from "express";
const router = express.Router();
import { UserModel } from "../db.js";
import { auth } from "../middlewares/auth.js";
import type { ObjectId } from "mongoose";

interface Room {
  Roomid: ObjectId | null;
  Roomname?: string;
}

router.get("/GetRooms", auth, async (req, res) => {
    const userid = req.user?.id; 
    try {
        const user = await UserModel.findById(userid);
        if (!user) {
            return;
        }
        const Rooms = (user.Rooms as Room[]).map((room) => ({
            Roomid: room.Roomid?room.Roomid.toString():null,
            Roomname: room.Roomname,
        }));
        res.status(200).send({
            Rooms
        })
    } catch (err) {
        res.status(400).send({
            error: err
        })
    }
})

export default router;