const Personality = require('../models/Personality');

// @desc    Get all personalities
// @route   GET /api/personalities
// @access  Public
const getPersonalities = async (req, res) => {
  try {
    const personalities = await Personality.find({}).sort({ createdAt: -1 });
    res.json(personalities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a personality
// @route   POST /api/personalities
// @access  Private/Admin
const createPersonality = async (req, res) => {
  try {
    const personality = new Personality(req.body);
    const createdPersonality = await personality.save();
    res.status(201).json(createdPersonality);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a personality
// @route   PUT /api/personalities/:id
// @access  Private/Admin
const updatePersonality = async (req, res) => {
  try {
    const personality = await Personality.findById(req.params.id);

    if (personality) {
      personality.name = req.body.name || personality.name;
      personality.era = req.body.era || personality.era;
      personality.description = req.body.description || personality.description;
      personality.image = req.body.image || personality.image;

      const updatedPersonality = await personality.save();
      res.json(updatedPersonality);
    } else {
      res.status(404).json({ message: 'Personality not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a personality
// @route   DELETE /api/personalities/:id
// @access  Private/Admin
const deletePersonality = async (req, res) => {
  try {
    const personality = await Personality.findById(req.params.id);

    if (personality) {
      await Personality.deleteOne({ _id: personality._id });
      res.json({ message: 'Personality removed' });
    } else {
      res.status(404).json({ message: 'Personality not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPersonalities,
  createPersonality,
  updatePersonality,
  deletePersonality,
};
