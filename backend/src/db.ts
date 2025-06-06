import mongoose, { Schema, Document, Model } from 'mongoose';

interface User extends Document {
  email: string;
  password: string;
  publicKey: string;
  privateKey: string;
}

const userSchema: Schema<User> = new Schema<User>({
  email: { type: String, required: true, unique : true},
  password: { type: String, required: true },
  publicKey: { type: String, required: true },
  privateKey: { type: String, required: true },
});

const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

export default UserModel;
