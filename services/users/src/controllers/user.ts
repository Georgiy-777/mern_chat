import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rebbitmq.js";
import { redisClient } from "../config/redis.js";
import TryCatch from "../helpers/index.js";
import { User } from "../model/User.js";

export const loginUser = TryCatch(async(req, res)=> {
	const { email } = req.body
	const rateLimitKey = `otp:rate_limit:${email}`;
	const rateLimit = await redisClient.get(rateLimitKey);
	if(rateLimit) {
		res.status(429).json({ message: "Too many requests. Please try again later." });
		return;
	}
	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	await redisClient.setEx(`otp:${email}`, 300, otp); // OTP valid for 5 minutes
	await redisClient.setEx(rateLimitKey, 60, '1'); // Rate limit for 1 minute
	const mes = {
		to: email,
		subject: "Your OTP Code",
		body: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
	}

	await publishToQueue("send-otp", JSON.stringify(mes));

	res.status(200).json({ message: "OTP sent successfully", otp });
})

export const verifyUser = TryCatch(async(req, res)=> {
	const { email, otp: entredOtp } = req.body;
	
	if (!email || !entredOtp) {
		res.status(400).json({ message: "Email and OTP are required" });
		return;
	}


	const storedOtp = await redisClient.get(`otp:${email}`);
	if (!storedOtp || storedOtp !== entredOtp) {
		res.status(400).json({ message: "Invalid or expired OTP" });
		
	}

	await redisClient.del(`otp:${email}`); // OTP can be used only once
	let user = await User.findOne({ email });
	if (!user) {
		const userName = email.split('@')[0];
		user = await User.create({ name: userName, email });
	}
	const token = generateToken(user);
	res.status(200).json({ message: "OTP verified successfully",user, token });
})