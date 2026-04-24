const Song = require('../models/Song');

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
exports.getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: songs.length, data: songs });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new song
// @route   POST /api/songs
// @access  Private/Admin
exports.addSong = async (req, res, next) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json({ success: true, data: song });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a song
// @route   DELETE /api/songs/:id
// @access  Private/Admin
exports.deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }
    await song.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
