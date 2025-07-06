// badminton_backend/models/Session.js

const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  gameNumber: { type: Number, required: true },
  status: { 
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned',
  },
  startTime: { type: Date },
  endTime: { type: Date },
  courtNumber: { type: Number }, // Added courtNumber to track where the game is played
}, { _id: false });

const SessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  // --- [NEW] Add zone field ---
  zone: {
    type: String,
    required: true,
    enum: ['บางนา', 'ลาดพร้าว'],
  },
  playersPresent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  gamesPlayed: [GameSchema],
  paymentType: { 
    type: String,
    enum: ['fixed_per_person', 'per_game'],
    default: 'fixed_per_person',
  },
  fixedCostPerPerson: {
    type: Number,
    default: 0,
  },
  costPerGameBreakdown: {
    courtCost: { type: Number, default: 0 },
    shuttlecockCostPerGame: { type: Number, default: 0 },
  },
  playerCosts: {
    type: Map,
    of: {
      cost: { type: Number, default: 0 },
      isPaid: { type: Boolean, default: false },
    },
    default: {},
  },
  notes: {
    type: String,
    default: '',
  },
  // --- [NEW] Add buddyPairs field ---
  buddyPairs: {
    type: Map,
    of: String, // Key: player_id, Value: buddy_id
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', SessionSchema);
