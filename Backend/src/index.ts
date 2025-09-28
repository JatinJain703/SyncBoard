import express from "express"
import signuprouter from "./Routes/signup.js"
import loginrouter from "./Routes/login.js"
import roomrouter from "./Routes/Room.js"
import GetRoomsrouter from "./Routes/GetRooms.js"
const app=express()
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config(); 
const mongourl = process.env.mongourl!;
mongoose.connect(mongourl);

app.use(express.json())
app.use(cors())

app.use("/auth",signuprouter);
app.use("/auth",loginrouter);
app.use("/",roomrouter);
app.use("/",GetRoomsrouter);
app.listen(3000);