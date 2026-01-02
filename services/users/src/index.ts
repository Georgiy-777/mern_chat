import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.js'
dotenv.config();
import connectDb from './config/db.js';
import { redisClient } from './config/redis.js';
connectDb();
redisClient.connect().then(()=>console.log(`Redis connected`)).catch(console.error)
const app = express()
app.use('api/v1', userRouter)
const port = process.env.PORT

app.listen(port, () => {
	console.log(`Server running on port :${port}`)
})