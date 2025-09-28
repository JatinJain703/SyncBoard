import dotenv from "dotenv"
import type { Request,Response,NextFunction } from "express";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
import jwt, { type JwtPayload } from "jsonwebtoken"

declare global {
  namespace Express {
    interface Request {
      user?: { id: string }
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const info = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!info || !info.id) return res.status(401).json({ message: "Invalid token payload" });

    req.user = { id: info.id }; 
    next();
  } catch(err) {
    res.status(401).json({ message: "Invalid token" });
  }
}
