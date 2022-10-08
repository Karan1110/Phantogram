const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const { postSchema } = require('./post');
const { followerSchema } = require('./follower');

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 50,
          unique: true
     },
     email: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 255,
          unique: true
     },
     password: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 1024
     },
     bio: {
          type: String,
          min: 10,
          max: 30
     },
     posts: {
          type: [postSchema],
          default: [],
          required: false
     },
     savedPosts: {
          type: [postSchema],
          default: [],
          required: false
     },
     followers: {
          type: [followerSchema],
          default: [],
          required: false
     },
     suggested: {
          type: [followerSchema],
          default: [],
          required: false
     },
     PrivacySettings: {
          blocked: [mongoose.SchemaTypes.ObjectId],
          muted: [mongoose.SchemaTypes.ObjectId],
          restricted: [String],
          interestedIn: {
               accounts: [String],
               posts: [String]
          },
     },
     interaction: {
          accounts: [String],
          posts: [String]
     },
     notifications: {
          type: [String],
          default: [],
          required: false
     }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
     const token = jwt.sign(
          {
               _id: this._id,
               name: this.name,
               email: this.email,
          },
          process.env.JwtKey
     );
     return token;
};

const User = mongoose.model('users', userSchema);

const validateUser = (user) => {
     const schema = {
          name: Joi.string()
               .min(2)
               .max(50)
               .required(),
          email: Joi.string()
               .min(5)
               .max(255)
               .required()
               .email(),
          password: Joi.string()
               .min(5)
               .max(255)
               .required()
     };
     return Joi.validate(user, schema);
};

exports.userSchema = userSchema;
exports.User = User;
exports.validateUser = validateUser;