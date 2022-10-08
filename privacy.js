const router = require('express').Router();
const { User } = require('../models/user');
const auth = require('../middleware/auth');

router.post('/interestedIn', [auth], async (req, res) => {
     try {
          const { inp } = req.body;
          const user = await User.findById(req.user._id).select('-password');
          user.privacySettings.interestedIn.push(inp)
          await user.save()
          console.log('done')
          res.status(200).json(user.interestedIn);
     } catch (ex) {
          console.log(ex.message);
          res.status(200).json('something went wrong');
     }
});


router.delete('/interestedIn', [auth], async (req, res) => {
     try {
          const user = await User.findById(req.user._id).select('-password');
          const { inp } = req.body;
          user.privacySettings.interestedIn.remove(inp)
          await user.save();
          console.log('done')
          res.status(200).json(user.interestedIn);
     } catch (ex) {
          console.log(ex.message);
          res.status(200).json('something went wrong');
     }
});

const itemCounter = (x, item) => {
     let counter = 0;
     x?.flat(Infinity).forEach(x => {
          if (x === item) {
               counter++
          }
     });
     return counter;
};

const perCounter = (num, per) => {
     return (num / 100) * per;
}

const interactionPusher = async (x, y, z) => {
     try {
          x.interaction.accounts.push(y.email)
          x.interaction.posts.push(z.tags, z.location)
          await y.save();
     } catch (ex) {
          console.log(ex.message);
     }
};

const interactionLimit = async (x) => {
     try {
          if (perCounter(x.followers.length, 502) === perCounter(interaction.accounts.length, 100)) {
               x.interaction.accounts.splice(1, 3);
               await x.save();
          } else if (perCounter(x.followers.length, 504) === perCounter(interaction.posts.length, 100)) {
               x.interaction.posts.splice(1, 3);
               await x.save();
          }
     } catch (ex) {
          console.log(ex.message);
     }
};

const interestedInLimit = async (x) => {
     try {
          if (perCounter(x.followers.length, 202) === perCounter(interestedIn.accounts.length, 100)) {
               x.interaction.accounts.splice(1, 3);
               await x.save();
          } else if (perCounter(x.followers.length, 204) === perCounter(interaction.posts.length, 100)) {
               x.interaction.posts.splice(1, 3);
               await x.save();
          }
     } catch (ex) {
          console.log(ex.message);
     }
};

const interestedInPusher = async (x) => {
     try {
          const kat = x.interaction.accounts.find((y, index, arr) => {
               const s = itemCounter(x.interaction.accounts, arr.some());
               return perCounter(x.interaction.accounts, 25) !== perCounter(x.interaction.accounts, s);
          });
          const pat = x.interaction.posts.find((y, index, arr) => {
               const s = itemCounter(x.interaction.posts, arr.some());
               return perCounter(x.interaction.posts, 2) !== perCounter(x.interaction.posts, s);
          });
          if (!kat || !pat) return console.log("There r no interests yet for the user");
          else {
               x.PrivacySettings.interestedIn.accounts.push(kat)
               x.PrivacySettings.interestedIn.posts.push(pat)
               await x.save();
          }
     } catch (ex) {
          console.log(ex.message);
     }
};


const isBlocked = async (inp, b) => {
     try {
          const user = await User.find({ email: inp }).select('-password');
          const xer = await User.find({ email: b }).select('-password');
          if (user.PrivacySettings.blocked.includes(xer._id)) return true;
          return false;
     } catch (ex) {
          console.log(ex.message);
     }
};



const isRestricted = async (inp, inp2) => {
     try {
          const user = await User.find({ email: inp }).select('-password');
          const x = await User.find({ email: inp2 }).select('-password');
          if (user.PrivacySettings.restricted.includes(x._id) || x.PrivacySettings.restricted.includes(user._id)) return true;
          return false;
     } catch (ex) {
          console.log(ex.message);
     }
};
const isMuted = async (inp, inp2) => {
     try {
          const user = await User.find({ email: inp }).select('-password');
          const x = await User.find({ email: inp2 }).select('-password');
          if (user.PrivacySettings.muted.includes(x._id)) return true;
          return false;
     } catch (ex) {
          console.log(ex.message);
     }
};

const restricted = (x, myID) => {
     try {
          const i = x.posts.forEach((a, b, c, d) => {
               let lol = x.PrivacySettings.restricted.some(x => { return x; })
               let lole = a.comments.some(x => { return x; }).postedBy;

               if (lol === lole && myID !== lol || a.postBy) {
                    const FU = a.comments.filter((a, b, c, d) => {
                         return a.postedBy === lol;
                    });
                    return FU;
               } else {
                    return;
               }
          });
          return i;
     } catch (ex) {
          console.log(ex.message);
     }
}


// exports.restricted = restricted;
exports.itemCounter = itemCounter();
module.exports = router;