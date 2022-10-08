const router = require('express').Router();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { User } = require('../models/user');
const auth = require('../middleware/auth');

router.put('/like', [auth], async (req, res) => {
     try {
          const { userID, postID } = req.body;
          const reci = await User.findById(userID).select('-password');
          const user = await User.findById(req.user._id).select('-password');
          const posts = reci.posts;
          let post = posts.id(postID);
          if (post.likes.likedAccounts.includes(req.user.email)) {
               console.log('u have to do to the dislike route.');
          } else {
               post.likes.likedAccounts.push(req.user.email)
               post.likes.noOfLikes = +1
               await reci.save();
               reci.notifications.push(`${req.user.name} has liked on on your post `);
               await reci.save();
               add(user, user.email, post.tags)
               console.log('yayyy!!!!!!!!!')
          }
     } catch (ex) {
          console.log(ex.message);
          res.status(500).send('Something failed.');
     };
});
router.put('/dislike', [auth], async (req, res) => {
     try {
          const { error } = validateId(req.body);
          if (error) return res.status(400).send(error.details[0].message);

          const { userID, postID } = req.body;

          const reci = await User.findById(userID).select('-password');
          const posts = reci.posts;
          let post = posts.id(postID);
          if (post.likes.likedAccounts.includes(req.user.email)) {
               post.likes.likedAccounts.remove(req.user.email)
               post.likes.noOfLikes = -1;
               reci.notifications.push(`${req.user.name} has liked on on your post `); // here u have to give the link of the post this has to done in the front-end.
               await reci.save();
               add(user, user.email, post.tags)
               console.log('yayyy!!!!!!!!!')
          } else {
               console.log('nooo!!!!!!')
          }
     } catch (ex) {
          console.log(ex.message);
          res.status(500).send('Something failed.');
     };
});

const validateId = (req) => {
     const schema = {
          userID: Joi.objectId().required(),
          postID: Joi.objectId().required()
     }
     return Joi.validate(req, schema);
};

module.exports = router;