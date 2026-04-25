const Attire = require('../models/Attire');

// @desc    Fetch all attires
// @route   GET /api/attires
// @access  Public
const getAttires = async (req, res) => {
  try {
    const attires = await Attire.find({});
    res.json(attires);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching attires' });
  }
};

// @desc    Fetch single attire
// @route   GET /api/attires/:id
// @access  Public
const getAttireById = async (req, res) => {
  try {
    const attire = await Attire.findById(req.params.id);
    if (attire) {
      res.json(attire);
    } else {
      res.status(404).json({ message: 'Attire not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an attire
// @route   POST /api/attires
// @access  Private/Admin
const createAttire = async (req, res) => {
  try {
    const { name, description, category, price, stock, image, sizes } = req.body;
    
    const attire = new Attire({
      name,
      description,
      category,
      price,
      stock,
      image,
      sizes
    });

    const createdAttire = await attire.save();
    res.status(201).json(createdAttire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating attire' });
  }
};

// @desc    Update an attire
// @route   PUT /api/attires/:id
// @access  Private/Admin
const updateAttire = async (req, res) => {
  try {
    const { name, description, category, price, stock, image, sizes } = req.body;

    const attire = await Attire.findById(req.params.id);

    if (attire) {
      attire.name = name || attire.name;
      attire.description = description || attire.description;
      attire.category = category || attire.category;
      attire.price = price || attire.price;
      attire.stock = stock !== undefined ? stock : attire.stock;
      attire.image = image || attire.image;
      attire.sizes = sizes || attire.sizes;

      const updatedAttire = await attire.save();
      res.json(updatedAttire);
    } else {
      res.status(404).json({ message: 'Attire not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating attire' });
  }
};

// @desc    Delete an attire
// @route   DELETE /api/attires/:id
// @access  Private/Admin
const deleteAttire = async (req, res) => {
  try {
    const attire = await Attire.findByIdAndDelete(req.params.id);
    
    if (attire) {
      res.json({ message: 'Attire removed' });
    } else {
      res.status(404).json({ message: 'Attire not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting attire' });
  }
};

module.exports = {
  getAttires,
  getAttireById,
  createAttire,
  updateAttire,
  deleteAttire
};
