import mongoose from "mongoose";


const connectDb = async () => {
	const url = process.env.MONGO_URL;

	if (!url) {
		throw new Error('MONGO_URL is not define')
	}

	try {
		await mongoose.connect(url, {
			dbName: "Chatappmicroservices"
		});
		console.log('Connected to MongoDb')
	} catch (error) {
		console.error('Failed to connected to MongoDb')
		process.exit(1)
	}

}

export default connectDb;