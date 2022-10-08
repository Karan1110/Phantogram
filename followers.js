const express = require("express");
const router = express.Router();
const { User } = require('../models/user');
const { validateFollowID } = require('../models/follower');
const auth = require('../middleware/auth');

router.post('/add', [auth], async (req, res) => {
     try {
          const { error } = validateFollowID(req.body);
          if (error) return res.status(400).send(error.details[0].message);

          const { followID } = req.body;

          const user = await User
               .findById(req.user._id)
               .select('-password');
          const followers = user.followers;
          // here i am using "tru" because in JS true is a boolean and i cant use.
          const tru = followers?.find((follower) => {
               return follower._id === followID
          });

          if (tru) {
               console.log('sus');
               res.status(400).json({ message: "The person is already ur follower" });
          } else if (!tru) {
               const follower = await User.findById(followID).select('-password');
               if (!follower) return res.status(400).send('user deosnt excist btw...!');

               const obj = {
                    _id: followID,
                    name: follower.name,
                    email: follower.email
               };
               user.followers.push(obj);
               await user.save();
               const notifications = follower.notifications;
               notifications.push(`${req.user.name} has followed u`)
               await follower.save()
               res.status(200).send('done');
               console.log('done');
          };
     } catch (error) {
          res.status(400).send('something went wrong');
          console.log(error.message);
     }
});

router.delete('/remove', [auth], async (req, res) => {
     try {
          const { error } = validateFollowID(req.body);
          if (error) return res.status(400).send(error.details[0].message);

          const { followID } = req.body;
          const follower = await User.findById(followID).select('-password');
          const user = await User.findById(req.user._id).select('-password');
          const followers = user.followers;
          const tru = followers?.find((follower) => {
               return follower._id === followID
          });
          if (tru) {
               const f = followers.id(followID);
               f.remove();
               await user.save();
               const notifications = follower.notifications;
               notifications.push(`${req.user.name} has unfollowed u`)
               await follower.save()
               console.log('done');
               res.status(200).send('done')
          } else if (!tru) {
               console.log('sus');
               res.send('send')
          }
     }
     catch (error) {
          res.status(400).send('something went wrong');
          console.log(error.message);
     }
});

router.get('/suggested', [auth], async (req, res) => {
     try {
          const cUser = await User.findById(req.user._id).select('-password');
          const fs = cUser.followers;

          const lol = fs.forEach((x) => {
               return x.followers;
          });

          if (!lol) return res.status(400).json({ message: "U dont have any mutual followers" });

          const mutualFollowers = lol.find((d) => {
               return cUser.PrivacySettings.blocked.some()._id === d._id
          });

          const suggested = mutualFollowers.flat(Infinity).forEach(async (a) => {
               function percentage(num, per) {
                    return (num / 100) * per;
               }

               function is(x) {
                    return x.accounts && posts.flat(Infinity).find((element) => {
                         return element.some(percentage) !== cUser.PrivacySettings[accounts, posts].some(percentage);
                    });
               }
               const gee = is(a.PrivacySettings.interestedIn);

               return await User
                    .find({ _id: a._id, 'PrivacySettings[accounts,posts]': gee })
                    .select('-password');
          });
          const suggestedAccounts = suggested;
          if (!suggestedAccounts) return res.status(400).json({ message: "no suggestions for u yet." });

          cUser.suggested.push(suggestedAccounts)
          await cUser.save();

          res.status(200).json({ message: "User suggestions updated." });
          console.log(suggestedAccounts);
     } catch (ex) {
          res.status(400).json({ message: "Internal Server error" });
          console.log(ex.message);
     }
});

const isMutual = async (inp, myId) => {
     try {
          const user = await User.findById(myId).select('-password');
          const la = user.followers?.forEach(f => {
               return f._id;
          })
          const followers = await User.find({ _id: { $elemMatch: la } }).select('-password');
          const mUser = followers?.find(x => {
               return x.some(element, index, array).followers.name !== inp && x.some(element, index, array).followers.name !== user.followers.name;
          })
          if (!MU) return res.status(200).json({ message: "User not mutual." });
          const mutual = true
          return mUser, mutual;
     } catch (ex) {
          console.log('fuckoff', ex.message);
     }
};

module.exports = router;

