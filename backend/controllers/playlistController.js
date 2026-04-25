const Playlist = require('../models/Playlist');
const User = require('../models/User');

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res) => {
  try {
    const { name, coverImage, isPublic } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }

    const playlist = await Playlist.create({
      name,
      user: req.user.id,
      coverImage,
      isPublic
    });

    // Add to user's playlists array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { playlists: playlist._id }
    });

    res.status(201).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's playlists
// @route   GET /api/playlists/my-playlists
// @access  Private
const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).populate('songs');
    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a specific playlist
// @route   GET /api/playlists/:id
// @access  Public
const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs').populate('user', 'name avatar');
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (!playlist.isPublic && (!req.user || playlist.user._id.toString() !== req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this playlist' });
    }

    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: 'Song already in playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();
    
    await playlist.populate('songs');
    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove a song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    playlist.songs = playlist.songs.filter(id => id.toString() !== req.params.songId);
    await playlist.save();
    
    await playlist.populate('songs');
    res.json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist
};
