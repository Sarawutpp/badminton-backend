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
  skillLevel: { // ใช้ skillLevel ใน Backend (สามารถ mapping จาก skill ใน Frontend)
    type: Number,
    required: true,
  },
  // --- เพิ่ม Field ใหม่ ---
  gamesPlayed: { // จำนวนเกมที่เล่นแล้ว
    type: Number,
    default: 0,
  },
  availableFrom: { // เวลาเริ่มเล่นได้ (HH:mm)
    type: String,
    default: '00:00',
  },
  availableTo: { // เวลาสิ้นสุดการเล่น (HH:mm)
    type: String,
    default: '23:59',
  },
  pastPartners: [{ // รายชื่อผู้เล่นที่เคยเล่นด้วย (IDs)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  // --- สิ้นสุด Field ใหม่ ---
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Player', PlayerSchema);