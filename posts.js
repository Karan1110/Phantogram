const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const { Post, validate } = require('../models/post');
const _ = require('lodash');

router.get('/', [auth], async (req, res) => {
     try {
          const user = await User
               .findById(req.user._id)
               .select('-password');
          const posts = user.posts;
          res.status(200).json({ Posts: posts });
     } catch (ex) {
          console.log(ex.message, ex);
          res.status(500).send('Something failed.');
     }
});

router.post('/', [auth], async (req, res) => {
     try {
          const { error } = validate(req.body);
          if (error) return res.status(400).send(error.details[0].message);

          const user = await User
               .findById(req.user._id)
               .select('-password');

          let post = new Post({
               postBy: {
                    email: req.user.email,
                    _id: req.user._id
               },
               name: req.body.name,
               location: req.body.location,
               tags: req.body.tags,
               caption: req.body.caption
          });

          user.posts.push(post);
          await user.save();

          res.status(201).json(post);
     } catch (ex) {
          console.log(ex.message);
          res.status(500).send('Something failed.');
     }
});

router.put('/:id', [auth], async (req, res) => {
     try {
          const { error } = validate(req.body);
          if (error) return res.status(400).send(error.details[0].message);

          const user = await User.findById(req.user._id).select('-__v -password');
          user.update(
               { _id: req.user._id, "posts": req.params.id },
               {
                    $set: {
                         postBy: {
                              email: req.user.email,
                              _id: req.user._id
                         },
                         name: req.body.name,
                         location: req.body.location,
                         caption: req.body.caption,
                         tags: req.body.tags
                    }
               }
          );
          const post = user.posts.id(req.params.id);
          res.status(201).json(post);
     } catch (ex) {
          console.log(ex.message);
          res.status(500).send('Something failed.');
     }
});

router.delete('/:id', [auth], async (req, res) => {
     try {
          const { error } = validate(req.body);
          if (error) return res.status(400).send(error.details[0].message);

          const user = await User.findById(req.user._id).select('-__v -password');
          user.update(
               { _id: req.user._id, "posts": req.params.id },
               {
                    $unset: {
                         postBy: {
                              email: req.user.email,
                              _id: req.user._id
                         },
                         name: req.body.name,
                         location: req.body.location,
                         caption: req.body.caption,
                         tags: req.body.tags
                    }
               }
          );
          const post = user.posts.id(req.params.id);
          res.status(201).json(post);
     } catch (ex) {
          console.log(ex.message);
          res.status(500).send('Something failed.');
     };
});

module.exports = router;