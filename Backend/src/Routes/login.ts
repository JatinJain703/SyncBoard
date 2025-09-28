import express from "express";
const router = express.Router();
import { UserModel } from "../../../shared/dist/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let user;
    try {
        user = await UserModel.findOne({
            email: email,
        })
    } catch (e: any) {
        res.status(500).json({
            message: "something wrong in server"
        });
    }

    if (!user) {
        res.status(403).send({
            message: "user does not exist"
        })
        return;
    }
    const passmatch = await bcrypt.compare(password, user.password!);
    if (!passmatch) {
        res.status(403).send({
            message: "Wrong password"
        })
        return;
    }
    const token = jwt.sign({
        id: user._id
    }, JWT_SECRET)
    res.json({
        token: token,
        message: "you are logged in"
    })
})

export default router;