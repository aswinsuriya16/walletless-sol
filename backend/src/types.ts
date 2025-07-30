import { Request } from "express";
import { Types } from "mongoose";

export interface IUser extends Request {
  user? :{
    _id: Types.ObjectId;
    email: string;
    password: string;
    publicKey: string;
  }
}
