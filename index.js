const express = require('express');
const app = express();
const session = require('express-session');
const https = require('https');
const mongoose = require('mongoose');
const users = require('./routes/users');
const logins = require('./routes/logins');
const posts = require('./routes/posts');
const likes = require('./routes/likes');
const comments = require('./routes/comments');
const followers = require('./routes/followers');
const saves = require('./routes/saves');
const privacy = require('./routes/privacy');
const feed = require('./routes/feed');
const hashtags = require('./routes/hashtags');
const dotenv = require('dotenv').config();

app.set('trust proxy', 1);
app.use(session({
     secret: process.env.SS,
     resave: false,
     saveUninitialized: true,
     cookie: { secure: true }
}));

app.use(express.json());

app.all("*", function findLastVisit(req, res, next) {
     if (req.session.visited)
          req.lastVisit = req.session.visited
     req.preLastVisit = req.session.store.all((err, x) => {
          let i = x.findIndex((a, b, c) => {
               return b;
          });

          let preLastVisit = x.findIndex((a, b, c) => {
               let lol = i - 1
               return b === lol, a;
          })
          return preLastVisit;
     });
     req.session.visited = Date.now()
     next();
})

app.use('/api/users', users);
app.use('/api/logins', logins);
app.use('/api/users/posts', posts);
app.use('/api/users/posts/likes', likes);
app.use('/api/users/posts/comments', comments);
app.use('/api/users/followers', followers);
app.use('/api/users/savePost', saves);
app.use('/api/users/privacySettings', privacy);
app.use('/api/users/feed', feed);
app.use('/api/users/hashtags', hashtags);

mongoose.connect('mongodb://localhost/SharMe')
     .then((result) => {
          console.log('Connected to MongoDB...');
     }).catch((ex) => {
          console.log('Could not connect to MongoDB...', ex.message);
     });

const port = process.env.PORT;
app.listen(port, () => {
     console.log(`Server running on http://localhost:${port} ...`);
});