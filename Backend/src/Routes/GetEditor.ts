import express from "express";
const router=express.Router();
import { RoomModel } from "../../../shared/dist/db.js";
import { auth } from "../middlewares/auth.js";

router.post("/GetEditor",auth,async(req,res)=>{
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
        snapshot:Room?.editorState||null
    })
  }catch(err){
     res.status(500).send({
            message:"Backend error"
        })
  }
})
export default router;