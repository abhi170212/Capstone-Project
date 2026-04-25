const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPlaylist);
router.get('/my-playlists', protect, getMyPlaylists);
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);

// Public route must be placed carefully, usually with an optional auth middleware if we want to check user ownership, but simple protect is fine if we want all playlists to be authenticated, wait, sharing means it could be public. We'll use a custom middleware or just allow it and check req.headers.authorization manually, but for simplicity let's just make getPlaylistById public but check if it's public. Wait, if it's public, we don't need `protect`.
router.get('/:id', getPlaylistById);

module.exports = router;
