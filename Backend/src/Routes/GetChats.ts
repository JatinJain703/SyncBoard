import express from "express";
const router = express.Router();
import { RoomModel } from "../db.js";
import { auth } from "../middlewares/auth.js";

router.get("/GetChats", auth,async (req, res) => {
    const Roomid=req.body.Roomid;
    try{
        const Room=await RoomModel.findById(Roomid);
        if(!Room)
        {
            res.status(400).send({
                message:"Room does not exist"
            })
        }
        res.status(200).send({
            chat:Room?.chat||[]
        })
    }catch(err){
       res.status(500).send({
              message:"Backend error"
          })
    }   
})
export default router;