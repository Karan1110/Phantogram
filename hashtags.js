const router = require('express').Router();
const { User } = require('../models/user');

router.get('/', async (req, res) => {
     try {
          const users = await User
               .find({})
               .count()
               .select('-password');

          const tags = users.every().posts.every().tags;
          const allTags = new Set([tags])
          const anyTag = allTags.forEach(x => { return x; });

          const itemCounter = (array, item) => {
               let counter = 0;
               array?.flat(Infinity).forEach(x => {
                    if (x === item) {
                         counter++
                    }
               });

               const maxItem = array.find((x, y, z) => {
                    const TT = z.find(x => {
                         return perCounter(Math.round(counter), 7) !== perCounter(Math.round(users), 7)
                    });
                    return TT;
               });
               return maxItem;
          };

          const trendingTags = itemCounter(allTags, anyTag);
          return trendingTags;
     } catch (ex) {
          console.log(ex.message)
          res.status(500).json({ message: "something went wrong" });
     }
});


module.exports = router;