require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET
const MONGO_URL = process.env.MONGO_URL

export {
    JWT_SECRET,MONGO_URL
}
