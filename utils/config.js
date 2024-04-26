require('dotenv').config();
const Config = {
	mongo_url: process.env.MONGO_URI,		
	jwt_secret_user: process.env.JWT_SECRET_USER,
	mongodb_bucket:  process.env.MONGODB_BUCKET,
};

exports.Config= Config;