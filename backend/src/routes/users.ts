import { Router, Request, Response } from "express";
import { z } from 'zod';
import bcrypt from 'bcrypt';
import UserModel from "../db";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from 'bs58';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config";
import auth from '../middleware/auth';
//@ts-ignore
import sss from 'shamirs-secret-sharing';
import { Buffer } from 'buffer';
import { Schema, model } from 'mongoose';

// Define Mongoose schema for key shares
const KeyShareSchema = new Schema({
    userId: { type: String, required: true },
    shareId: { type: Number, required: true },
    share: { type: String, required: true }
});

const KeyShareModel = model('KeyShare', KeyShareSchema);

const userRouter = Router();

//signup
userRouter.post('/signup', async (req: Request, res: Response): Promise<any> => {
    const reqBody = z.object({
        email: z.string().email(),
        password: z.string()
    });

    const parsedBody = reqBody.safeParse(req.body);
    if (!parsedBody.success) {
        return res.status(400).json({
            msg: "Invalid Input format"
        });
    }

    const { email, password } = parsedBody.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ msg: "Email already in use" });
    }

    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const privateKey = keypair.secretKey;
    const privateKeyHex = Buffer.from(privateKey).toString('hex');
    const shares = sss.split(Buffer.from(privateKeyHex, 'hex'), { shares: 3, threshold: 2 });
    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        const user = await UserModel.create({
            email,
            password: hashedPassword,
            publicKey
        });

        const insertOps = shares.map((share: Buffer, index: number) => ({
            //@ts-ignore
            userId: user._id.toString(),
            shareId: index + 1,
            share: share.toString('hex'),
        }));

        await KeyShareModel.insertMany(insertOps);

        return res.json({
            msg: "Signup successful!",
            publicKey
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Error while saving to database" });
    }
});

//signin
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
        //@ts-ignore
        const shares = await KeyShareModel.find({ userId: user._id.toString() });
        
        const shareBuffers = shares.slice(0, 2).map(share => Buffer.from(share.share, 'hex'));
        const reconstructedKey = sss.combine(shareBuffers);
        const privateKey = bs58.encode(reconstructedKey);

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        return res.json({
            msg: "Signin successful",
            token,
            solanaPublicKey: user.publicKey,
            solanaPrivateKey: privateKey
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Server error during signin" });
    }
});

//airdrop SOL
userRouter.post("/airdrop", auth, async (req: Request, res: Response): Promise<any> => {
    const { publicKey, amount } = req.body;
    if (!publicKey || !amount) {
        return res.status(400).json({ msg: "Public key and amount are required" });
    }

    try {
        const lamports = Number(amount) * 1e9;
        if (isNaN(lamports) || lamports <= 0) {
            return res.status(400).json({ msg: "Invalid amount" });
        }
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const signature = await connection.requestAirdrop(new PublicKey(publicKey), lamports);
        await connection.confirmTransaction(signature, "confirmed");

        return res.json({ msg: "Airdrop successful", signature });
    } catch (e: any) {
        return res.status(500).json({ msg: "Airdrop failed", error: e.message });
    }
});

//Send SOL
interface AuthRequest extends Request {
    user?: any;
}

userRouter.post("/transfer", auth, async (req: AuthRequest, res: Response): Promise<any> => {
    const { toAddress, amount } = req.body;

    if (!toAddress || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ msg: "Invalid 'to' address or amount" });
    }

    try {
        const userId = req.user.userId;
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const shares = await KeyShareModel.find({ userId: userId });
        const shareBuffers = shares.slice(0, 2).map(share => Buffer.from(share.share, 'hex'));
        const reconstructedKey = sss.combine(shareBuffers);
        const secretKey = reconstructedKey;

        const senderKeypair = Keypair.fromSecretKey(secretKey);
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderKeypair.publicKey,
                toPubkey: new PublicKey(toAddress),
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );

        const signature = await connection.sendTransaction(transaction, [senderKeypair]);
        await connection.confirmTransaction(signature, "confirmed");

        res.json({ msg: "Transfer successful", signature });
    } catch (e: any) {
        res.status(500).json({ msg: "Transfer failed", error: e.message });
    }
});

export { userRouter };