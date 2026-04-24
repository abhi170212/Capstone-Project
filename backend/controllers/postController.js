const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { images, caption, location, category } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const post = await Post.create({
      user: req.user.id,
      images,
      caption,
      location,
      category,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error adding post' });
  }
};

// @desc    Get all posts (supports query filtering)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const { location, category } = req.query;
    let query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar');

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching posts' });
  }
};

// @desc    Get posts by specific user
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar');

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching user posts' });
  }
};

// @desc    Toggle Like on a Post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user.id);
    
    if (isLiked) {
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    
    // Return the updated likes array directly to update frontend easily
    res.json({ likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error modifying like' });
  }
};

// @desc    Add a comment to a Post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: req.user.id,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    // Populate user info before sending back
    const populatedPost = await Post.findById(req.params.id).populate('comments.user', 'name avatar');

    res.json(populatedPost.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error commenting' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership OR Admin
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed safely' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find comment
    const comment = post.comments.find(
      (c) => c._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership OR Admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this comment' });
    }

    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
};

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  toggleLike,
  addComment,
  deletePost,
  deleteComment
};
