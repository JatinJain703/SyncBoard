import mongoose from "mongoose";
const schema = mongoose.Schema;
const objectId = schema.Types.ObjectId;

const User=new schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    Rooms:[{
        Roomid:objectId,
        Roomname:String
    }]
})

const Room=new schema({
    hostid:objectId,
    name:String,
    createdAt:{type:Date,default:Date.now},
    chat:[
        {
            userid:objectId,
            message:String
        }
    ]
})

const UserModel=mongoose.model('User',User);
const RoomModel=mongoose.model('Room',Room);

export{
    UserModel,
    RoomModel
}