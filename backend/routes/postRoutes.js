const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPosts, 
  getUserPosts, 
  toggleLike, 
  addComment, 
  deletePost,
  deleteComment
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPosts);
router.get('/user/:userId', getUserPosts);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);
router.delete('/:id', protect, deletePost);

module.exports = router;
