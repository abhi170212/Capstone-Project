const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: {
      type: [String],
      validate: [arrayLimit, 'Cannot upload more than 10 images'],
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 2200,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 10 && val.length > 0;
}

module.exports = mongoose.model('Post', postSchema);
