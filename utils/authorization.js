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

exports.GetUserAuthorization =  async function (auth_header) {
  const auth_token = (auth_header || "").split("Bearer ").at(1);
  let token_data;
  try{
    token_data = jwt.verify(auth_token, Config.jwt_secret_user);
  } catch (e) {
  	return {error_code: 1001, message: 'ERROR: Authentication failed.'}
  }
  return token_data;
}