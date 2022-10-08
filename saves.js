const router = require('express').Router();
const { User } = require('../models/user');
const auth = require("../middleware/auth");

router.get('/', [auth], async (req, res) => {
     try {
          const user = await User.findById(req.user._id).select('-password');
          let SP = user.savedPosts;

          res.status(200).json(SP)
          console.log('done');
     } catch (ex) {
          res.status(400).send('something went wrong');
          console.log(ex.message);
     }
});

router.post('/', [auth], async (req, res) => {
     try {
          const { Uid, Pid } = req.body;
          const user = await User.findById(Uid).select('-password');
          const cUser = await User.findById(Pid).select('-password');

          const post = user.posts.id(Pid);
          cUser.savedPosts.push(post);
          await cUser.save();

          res.status(200).send('done');
          console.log('done');
     } catch (ex) {
          res.status(400).send('something went wrong');
          console.log(ex.message);
     }
});

router.delete('/deletePost', [auth], async (req, res) => {
     try {
          const { Sid } = req.body;
          const cUser = await User.findById(req.user._id).select('-password');

          cUser.savedPosts.remove(Sid);
          await cUser.save();

          res.status(200).send('done');
          console.log('done');
     } catch (ex) {
          res.status(400).send('something went wrong');
          console.log(ex.message);
     }
});

module.exports = router;