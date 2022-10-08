const router = require('express').Router();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { User } = require('../models/user');
const { isRestricted } = require('./privacy');
const auth = require('../middleware/auth');

// Route-1 : adding a comment
router.post('/', [auth], async (req, res) => {
     try {
          const { error } = validate(req.body);
          if (error) return res.status(400).send(error.details[0].message);
          const user = await User.findById(userID).select('-password');
        
          const { comment, userID, id } = req.body;

          const posts = user.posts;
          const post = posts.id(id);
          let email = req.user.email;

          let lol = {
               postedBy: email,
               comment: comment
          };

          post.comments.push(lol);
          await user.save();

          const notifications = user.notifications;
          notifications.push(`${req.user.name} has a comment on ur post`);
          await user.save()

          res.status(201).send(post.comments.comment)
          console.log('done');
     } catch (ex) {
          console.log(ex.message);
          res.status(500).json({ message: 'Something failed.' });
     };
});

// Route-2 Updating a comment
router.put('/:id', [auth], async (req, res) => {
     try {
          const { error } = validate(req.body);
          if (error) return res.status(400).send(error.details[0].message);
          const { userID, id } = req.params;
          const { comment } = req.body;
          const result = await User.findByIdAndUpdate(
               {
                    _id: userID, 'posts._id': id, 'comments._id': req.params.id
               },
               {
                    $set
                         : { postedBy: req.user.email, comment: comment }
               }, {
               new: true
          });
          console.log(result);
          res.status(200).json({ message: 'comment Updated.' });
     } catch (ex) {
          console.log(ex.message);
          res.status(500).json({ message: 'Something failed.' })
     };
});
// Route-3 deleting a comment
router.delete('/:id', [auth], async (req, res) => {
     let { userID, id } = req.body;
     try {
          const comment = await User.updateOne(
               {
                    _id: userID, 'posts._id': id
               },
               {
                    $pull: { 'posts.$.comments': { _id: req.params.id } }
               }
          );
          console.log(comment);
          res.status(200).json({ message: 'comment Deleted.' });
     } catch (ex) {
          console.log(ex.message);
          res.status(500).json({ message: 'Something failed.' })
     };
});

router.post('/reply', [auth], async (req, res) => {
     try {
          const { error } = validateReply(req.body);
          if (error) return res.status(400).send(error.details[0].message);

          const { userID, id, commentID, reply } = req.body;

          const user = await User.findById(userID).select('-password');
          const post = user.posts.id(id);
          const comments = post.comments;
          const comment = comments.id(commentID);
          // if (!comment) return res.status(400).send('not found');
          let email = req.user.email;

          comment.replies.push({
               repliedBy: email,
               reply: reply
          });
          await user.save();

          const xer = await User.findById(email).select('-password')
          xer.notifications.push(`${req.user.name} has a comment on ur post`);
          await user.save()

          res.status(201).send('Done.')
          console.log('done');
     } catch (ex) {
          console.log(ex.message);
          res.status(401).send('sus');
     }
});

const validate = (req) => {
     const schema = {
          userID: Joi.objectId().required(),
          id: Joi.objectId().required(),
          comment: Joi.string().min(5).max(2022).required()
     };
     return Joi.validate(req, schema);
};
const validateReply = (req) => {
     const schema = {
          userID: Joi.objectId().required(),
          id: Joi.objectId().required(),
          commentID: Joi.objectId().required(),
          reply: Joi.string().min(5).max(100).required()
     };
     return Joi.validate(req, schema);
};

module.exports = router;