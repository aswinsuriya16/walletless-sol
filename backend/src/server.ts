require("dotenv").config()
import express from 'express';
import { userRouter } from './routes/users';
import mongoose from 'mongoose';
import { MONGO_URL } from './config';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/user', userRouter);

async function main(){
    try{
        await mongoose.connect(MONGO_URL as string);
        console.log("Connected to the database");
        app.listen(3000,()=>{
            console.log("Port is listening on 3000");
        })
    }
    catch(e){
        console.log("Failed to connect to the database",e)
    }
}
main();