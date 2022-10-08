const { User } = require('../models/user.js');
const router = require('express').Router();
const auth = require('../middleware/auth');
const _ = require("lodash");
const moment = require('moment');
moment().format();

router.get('/feed/homepage', [auth], async (req, res) => {
     try {
          const user = await User.findById(req.user._id).select('-password');
          const followIDs = user.followers.forEach(x => {
               return x._id;
          });
          if (!followIDs) return res.status(200).json({ message: "no posts found for homepage feed" });
          const followers = await User.find({ _id: { $elemMatch: followIDs } }).select('-password');
          const posts = followers.forEach(x => {
               return x.posts;
          });
          if (!posts) return res.status(200).json({ message: "no posts found for homepage fee, suggested to watch the top posts page or the explore page." });
          const result = posts.find(x => {
               return Math.round(x.createdAt) > req.lastVisit;
          });
          if (!result) {
               const reResult = posts.find(x => {
                    return Math.round(x.createdAt) > req.preLastVisit;
               })
               const RRP = _.pick(reResult, ['name', 'location', 'tags', 'caption']);
               console.log('RRP done');
               return res.status(200).json({
                    feed: [RRP]
               });
          } else {
               const RP = _.pick(result, ['name', 'location', 'tags', 'caption']);
               console.log('done');
               return res.status(200).json({
                    feed: [RP]
               });
          }
     } catch (ex) {
          res.status(400).json({ message: "Internal server error" });
          console.log(ex.message);
     }
});

router.get('/feed/topPosts', [auth], async (req, res) => {
     try {
          const user = await User.findById(req.user._id).select('-password');
          const users = await User.find({}).select('-password');
          const interestedInAccounts = user.PrivacySettings.interestedIn.accounts.some(x => { return x; })
          const interestedInPosts = user.PrivacySettings.interestedIn.posts.some(x => { return x; })
          const anyUser = users.some(x => { return x; });
          const TRP1 = await User
               .find({ _id: anyUser._id, "posts.tags": interestedInPosts })
          and({ "posts.trending": true })
               .sort('-likes.noOfLikes', 'createdAt')
               .limit()
               .exec((err, posts) => {
                    if (err) {
                         console.log(err)
                    } else {
                         console.log('Done')
                    }
               });

          const TRP2 = await User
               .find({ _id: anyUser._id, "posts.postBy.email": /interestedInAccounts/ })
               .where('createdAt').gte('createdAt'.getDate() - 90)
               .sort('-likes.noOfLikes', 'createdAt')
               .limit()
               .exec((err, posts) => {
                    if (err) {
                         console.log(err)
                    } else {
                         console.log('Done')
                    }
               });
          const TRP3 = await User.find({ $elemMatch: { bio: interestedInPost, name: /interestedInAccounts.name/i } }).select('-password');

          return TRP1, TRP2;
     } catch (ex) {
          res.status(400).json({ message: "Internal server error" });
          console.log(ex.message);
     }
});

module.exports = router;