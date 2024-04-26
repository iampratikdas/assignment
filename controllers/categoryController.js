const moment = require('moment');
const { Category } = require('../models/categories');
const { GenKey } = require("../utils/genKey");
const {GenUserToken, GetUserAuthorization} = require("../utils/authorization");


exports.createCategory = async (req, res) => {
    try {
        const authorizationHeader =req.headers['authorization'];
        if (!authorizationHeader) {
          return res.status(401).send({ "msg": 'Authorization header missing' });
        }
        let token_data = await GetUserAuthorization(authorizationHeader);
        if (token_data.error_code > 0) {
          return   res.status(401).send({ "msg": 'Unautorized' });
        }
        const category_obj = {
            category_id: await GenKey(10, "numeric"),
            created_at: moment().unix(),
            category_name: req.body.category_name,
            description: req.body.description,
        };
        const newCategory = new Category(category_obj);
        await newCategory.save();
        res.status(200).json({ "msg": "New Category Created" });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

exports.listCategory = async (req, res) => {
    try {
        
        const authorizationHeader =req.headers['authorization'];
        if (!authorizationHeader) {
          return res.status(401).send({ "msg": 'Authorization header missing' });
        }
        let token_data = await GetUserAuthorization(authorizationHeader);
        if (token_data.error_code > 0) {
          return   res.status(401).send({ "msg": 'Unautorized' });
        }

        const categories = await Category.aggregate([
            { $match: {} }
        ]);
        res.status(200).json({ categories });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

