const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const followerSchema = new mongoose.Schema({
     _id: {
          type: String,
          default: String,
          required: false
     },
     name: String,
     email: String,
     bio: String
});

const validateFollowID = (req) => {
     const schema = {
          followID: Joi.objectId().required()
     };
     return Joi.validate(req, schema);
};

exports.validateFollowID = validateFollowID;
exports.followerSchema = followerSchema;
