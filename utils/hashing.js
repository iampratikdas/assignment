const bcrypt = require('bcrypt');
exports.encrypt = async function (value) {
    try {
        const saltRounds = 10;
        const plaintextPassword = value;

        let hashed = await bcrypt.hash(plaintextPassword, saltRounds);
        return hashed;
    } catch (error) {
        //console.error('Error sending email:', error);
        throw error;
    }
}

exports.verify = async function (enter_pass, store_pass) {
    try {
        const storedHash = store_pass;
        const enteredPassword = enter_pass;
        //console.log("passes", storedHash, enteredPassword);
        const is_match = await bcrypt.compare(enteredPassword, storedHash);
        //console.log("is_match====>", is_match);
        return is_match
    } catch (error) {
        //console.error('Error sending email:', error);
        throw error;
    }
}