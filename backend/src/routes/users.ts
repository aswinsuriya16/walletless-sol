import { Router, Request, Response } from "express";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import UserModel from "../db";
import { Keypair } from "@solana/web3.js";
import bs58 from 'bs58';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config";

const userRouter = Router();

userRouter.post('/signup', async (req: Request, res: Response) : Promise<any> => {
    const reqBody = z.object({
        email: z.string().email(),
        password: z.string()
    });

    const parsedBody = reqBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({
            msg : "Inavalid Input format"
        })
    }

    const { email, password } = parsedBody.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ msg: "Email already in use" });
    }

    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const privateKey = bs58.encode(keypair.secretKey);

    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        await UserModel.create({
            email,
            password: hashedPassword,
            publicKey,
            privateKey 
        });

        return res.json({
            msg: "Signup successful!",
            publicKey
            //privatekey
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Error while saving to database" });
    }
});

userRouter.post('/signin', async (req: Request, res: Response): Promise<any> => {
    const reqBody = z.object({
        email: z.string().email(),
        password: z.string()
    });

    const parsedBody = reqBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({ msg: "Invalid input format" });
    }

    const { email, password } = parsedBody.data;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Incorrect password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return res.json({
            msg: "Signin successful",
            token,
            solanaPublicKey: user.publicKey,
            solanaPrivateKey: user.privateKey 
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Server error during signin" });
    }
});


export { userRouter };
