const mongoose = require('mongoose');
const {replySchema} = require('./reply');
const commentSchema = new mongoose.Schema({
     postedBy: {
          type: String,
          required: false,
     },
     comment: {
          type: String,
          required: false
     },
     replies: {
          type: [replySchema],
          default: []
     }
});

exports.commentSchema = commentSchema;