import express from "express";
import { AccessToken } from "livekit-server-sdk";
import { string } from "zod";
const LiveKitapiKey=process.env.LivekitApiKey!;
const LiveKitsecret=process.env.LiveKitSecret!;
const router = express.Router();

const apiKey = LiveKitapiKey;
const apiSecret = LiveKitsecret;

router.get("/token", async (req, res) => {
  const { room, currentUserId} = req.query;

  if (!room || !currentUserId) {
    return res.status(400).json({ error: "Missing room or username" });
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: currentUserId as string,
  });
  at.addGrant({ roomJoin: true, room: room as string });

  const token = await at.toJwt();
  res.json({ token });
});

export default router;
