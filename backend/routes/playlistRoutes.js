const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPlaylist);
router.get('/my-playlists', protect, getMyPlaylists);
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);
router.delete('/:id', protect, deletePlaylist);

router.get('/:id', getPlaylistById);

module.exports = router;
