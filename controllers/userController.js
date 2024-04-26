const bcrypt = require('bcrypt');
const moment = require('moment');
const { User } = require('../models/user');
const {GenUserToken, GetUserAuthorization} = require("../utils/authorization");
const { encrypt } = require("../utils/hashing");
const { GenKey } = require("../utils/genKey");
const mongoose = require('mongoose');
const { connectDB } = require('../utils/connectDb');
const {Config} = require('../utils/config')

let gridFs;
connectDB.once('open', () => {
  gridFs = new mongoose.mongo.GridFSBucket(connectDB.db, {
    bucketName: Config.mongodb_bucket
  });
});

exports.login = async (req, res) => {
  try {
    const user =  await User.aggregate([
      { $match: { email: req.body.email } }
    ]);
    if (user.length === 0) {
      return res.status(404).send('User not found');
    }
    const validPassword = await bcrypt.compare(req.body.password, user[0].password);
    if (!validPassword) {
      return res.status(401).send('Invalid password');
    }
    let token = await GenUserToken(user[0], moment().unix());
    res.status(200).json({  user_details: user[0] , token: token});
  } catch (error) {
    console.log("user===>", error)
    res.status(500).send('Error logging in');
  }
};

exports.signUp = async (req, res) => {
  let filename = '';
  let upload_status = false;
  if (req.file) {
    filename = req.file.originalname.concat(moment().unix());
    const uploadStream = gridFs.openUploadStream(filename);

    uploadStream.write(req.file.buffer);
    uploadStream.end();
    let fileId;
    await uploadStream.on('finish', (err, file) => {
      upload_status = true;
    });
    uploadStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error uploading file');
    });
  }
  const user_details = {
    userId: await GenKey(20, "numeric"),
    created_at: moment().unix(),
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: await encrypt(req.body.password),
    account_id: await GenKey(10, "numeric"),
    profile_image: filename
  }

  try {
    const newUser = new User(user_details);
    await newUser.save();
    res.status(200).json({ "msg": "New User Created", upload_status });
  } catch (error) {
    res.status(500).send({ "msg": 'Error Sign Up in/Internal Server Error' });
  }
}

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.aggregate([
      { $match: { account_id: userId } }
    ]);

    if (user.length ===0) {
      return res.status(404).send('User not found');
    }

    const profile_image = user[0].profile_image; 
    const file = await gridFs.find({ filename: profile_image }).toArray();
    let userProfile = {
      account_id: user[0].account_id,
      email: user[0].email,
      first_name: user[0].first_name,
      last_name: user[0].last_name
    };

    if (!file || file.length === 0) {
      userProfile.profile_image = user.profile_image;
      res.status(200).json({userProfile});
    }else{
      const data = [];
      const downloadStream = gridFs.openDownloadStream(file[0]._id);
  
      downloadStream.on('data', (chunk) => {
        data.push(chunk);
      });
  
      downloadStream.on('end', () => {
        const buffer = Buffer.concat(data);
        const imageBase64 = buffer.toString('base64');
        userProfile.profile_image = imageBase64;
      });
      res.status(200).json({userProfile});
    }


  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.editUserProfile = async (req, res) => {
  const userId = req.params.id;
  let request_body = req.body;
  request_body.updated_at = moment().unix();

  if (request_body.password) {
    request_body.password = await encrypt(req.body.password)
  }

  try {
    const user = await User.aggregate([
      { $match: { account_id: userId } }
    ]);

    if (user.length === 0) {
      return res.status(404).send('User not found');
    }
   
    if (req.file) {
      const existingFile = await gridFs.find({ filename: user[0].profile_image }).toArray();
      if (existingFile.length > 0) {
        await gridFs.delete(existingFile[0]._id);
        console.log('Existing file deleted');
      }

      filename = req.file.originalname.concat(moment().unix());
      request_body.profile_image = filename;
      const uploadStream = gridFs.openUploadStream(filename);

      uploadStream.write(req.file.buffer);
      uploadStream.end();
      uploadStream.on('error', (err) => {
        console.error(err);
        res.status(500).send('Error uploading file');
      });
    }


    await User.findOneAndUpdate(
      { account_id: userId },
      { $set: request_body }
    );


    res.status(200).json({ 'msg': "profile is updated" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file');
  }
};
