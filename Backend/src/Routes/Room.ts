import express from "express"
const router = express.Router();
import { auth } from "../middlewares/auth.js";
import { RoomModel, UserModel } from "../../../shared/dist/db.js";

router.post("/CreateRoom", auth, async (req, res) => {
    const userid = req.user?.id;
    const name = req.body.name;
    try {
        const room = await RoomModel.create({
            hostid: userid,
            name
        })

        const user = await UserModel.findById(userid);
        if (user) {
            user.Rooms.push({
                Roomid: room._id,
                Roomname: name
            })
            await user.save();
        }
        res.status(200).send({
            roomid: room._id,
            roomname: name
        })
    } catch (err) {
        res.status(400).send({
            error: err
        })
    }
})
export default router