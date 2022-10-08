const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
     repliedBy: String,
     reply: String
});

exports.replySchema = replySchema;