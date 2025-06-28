// badminton_backend/models/Session.js

const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  gameNumber: { type: Number, required: true },
  // --- เพิ่ม Field ใหม่สำหรับสถานะ Match ---
  status: { // 'planned', 'active', 'completed', 'cancelled'
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned', // ค่าเริ่มต้นคือ 'planned' (จัดล่วงหน้า)
  },
  startTime: { type: Date }, // เวลาที่ Match เริ่มจริง
  endTime: { type: Date },   // เวลาที่ Match จบจริง
  // --- สิ้นสุด Field ใหม่ ---
}, { _id: false }); // ไม่สร้าง _id ให้แต่ละเกมย่อย

const SessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  playersPresent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // ผู้เล่นที่มาใน Session นี้
  gamesPlayed: [GameSchema], // รายละเอียดเกมที่เล่นไป (ตอนนี้รวมสถานะ Match)
  totalCost: { // ค่าใช้จ่ายรวม (อาจใช้หรือไม่ใช้ขึ้นอยู่กับ paymentType)
    type: Number,
    default: 0,
  },
  paymentType: { // 'fixed_per_person' หรือ 'per_game'
    type: String,
    enum: ['fixed_per_person', 'per_game'],
    default: 'fixed_per_person', // ค่าเริ่มต้น
  },
  fixedCostPerPerson: { // สำหรับแบบเหมาจ่ายต่อคน
    type: Number,
    default: 0,
  },
  costPerGameBreakdown: { // สำหรับแบบคิดต่อเกม
    courtCost: { type: Number, default: 0 },
    shuttlecockCostPerGame: { type: Number, default: 0 },
  },
  playerCosts: {
    type: Map,
    of: {
      amountOwed: { type: Number, default: 0 },
      isPaid: { type: Boolean, default: false },
    },
    default: {},
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', SessionSchema);