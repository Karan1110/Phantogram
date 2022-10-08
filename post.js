const Joi = require("joi");
const mongoose = require("mongoose");
const { commentSchema } = require("./comment");

const postSchema = new mongoose.Schema({
     postBy: {
          email: String,
          _id: mongoose.SchemaTypes.ObjectId
     },
     name: {
          type: String,
          required: false,
          minlength: 5,
          maxlength: 50, validate: {
               validator: function (v) { return v && v.length > 5; },
               message: 'The name of the post should atleast have a length of 5 characters.'
          }
     },
     location: {
          type: String,
          required: false,
          minlength: 5,
          maxlength: 255,
          validate: {
               validator: function (v) { return v && v.length > 0; },
               message: 'The location of the post should atleast have a length of 5 characters.'
          }
     },
     imageURL: String,
     tags: {
          type: [String],
          required: false,
          validate: {
               validator: function (v) { return v && v.length > 0; },
               message: 'A post should have at least 1 tag.'
          }
     },
     caption: {
          type: String,
          required: false,
          minlength: 5,
          maxlength: 1024,
          lowercase: true,
          validate: {
               validator: function (v) { return v && v.length > 0; },
               message: 'The location of the post should atleast have a length of 5 characters.'
          }
     },
     likes: {
          noOfLikes: {
               type: Number, default: 0
          },
          likedAccounts: {
               type: [String], default: [], required: false
          }
     },
     comments: {
          type: [commentSchema],
          default: []
     },
     trending: Boolean
}
     , { timestamps: true });

postSchema.methods.isTrending = function (f) {
     if (this.likes.noOfLikes >= perCounter(f, 300)) return this.trending = true;
     return this.trending = false;
};

const Post = mongoose.model('posts', postSchema);

const validatePost = (post) => {
     const schema = {
          name: Joi.string()
               .min(5)
               .max(50)
               .required(),
          location: Joi.string()
               .min(5)
               .max(255)
               .required(),
          tags: Joi.array()
               .required(),
          caption: Joi.string()
               .min(5)
               .max(1024)
               .required(),
     };
     return Joi.validate(post, schema);
};

exports.postSchema = postSchema;
exports.Post = Post;
exports.validate = validatePost;
