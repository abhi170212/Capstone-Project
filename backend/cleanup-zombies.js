require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bihar-tourism';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to DB for cleanup...');
    const posts = await Post.find();
    let deletedCount = 0;
    
    for (const post of posts) {
      if (!post.user) {
         await Post.findByIdAndDelete(post._id);
         deletedCount++;
         continue;
      }
      
      const userExists = await User.findById(post.user._id || post.user);
      if (!userExists) {
        await Post.findByIdAndDelete(post._id);
        deletedCount++;
      }
    }
    
    console.log(`Successfully removed ${deletedCount} orphaned posts!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
