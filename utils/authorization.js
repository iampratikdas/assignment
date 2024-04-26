const jwt = require('jsonwebtoken');
const {Config} = require('./config');

exports.GenUserToken = async function(user, creationUpdationTime) {
  try {
    const token = jwt.sign(
      {
        userId: user._id,
        createdAt: creationUpdationTime,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      Config.jwt_secret_user,
      { expiresIn: "1h" }
    );
    return token;
  } catch (error) {
    throw new Error('Error generating user token: ' + error.message);
  }
}