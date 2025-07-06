// badminton_backend/models/Player.js

const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  skillLevel: { 
    type: Number,
    required: true,
  },
  // --- [NEW] Add zone field ---
  zone: {
    type: String,
    required: true,
    enum: ['บางนา', 'ลาดพร้าว'], // Restrict to predefined zones
  },
  gamesPlayed: { 
    type: Number,
    default: 0,
  },
  availableFrom: { 
    type: String,
    default: '00:00',
  },
  availableTo: { 
    type: String,
    default: '23:59',
  },
  pastPartners: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Player', PlayerSchema);
