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
  courtLabel: { type: String },
}, { _id: false });

// --- [NEW] Schema for individual activity logs ---
const ActivityLogSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  status: {
    type: String,
    enum: ['WAITING', 'PLAYING'],
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
}, { _id: false });


const SessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  zone: {
    type: String,
    required: true,
    enum: ['บางนา', 'ลาดพร้าว'],
  },
  courtLabels: {
    type: [String],
    default: ['1', '2', '3', '4', '5', '6'],
  },
  playersPresent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  gamesPlayed: [GameSchema],
  // --- [NEW] Add activityLogs array to the session ---
  activityLogs: [ActivityLogSchema],
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
  buddyPairs: {
    type: Map,
    of: String,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', SessionSchema);
