import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config";

interface AuthRequest extends Request {
    user?: any; 
}

function auth(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ msg: "Authorization header missing or malformed" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET as string);
    //console.log(decoded)
    req.user = decoded;
    next();
  } catch (e: any) {
    res.status(403).json({ msg: "Invalid or expired token", error: e.message });
  }
}


export default auth;