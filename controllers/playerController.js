// badminton_backend/controllers/playerController.js

const Player = require('../models/Player');

// Add a new player
exports.addPlayer = async (req, res) => {
  try {
    const { name, phoneNumber, skillLevel, gamesPlayed, availableFrom, availableTo, pastPartners } = req.body;
    if (!name || !skillLevel) {
      return res.status(400).send({ message: 'Name and skill level are required.' });
    }
    const newPlayer = new Player({
      name,
      phoneNumber: phoneNumber || '',
      skillLevel: parseInt(skillLevel),
      // --- เพิ่ม Field ใหม่ ---
      gamesPlayed: gamesPlayed || 0,
      availableFrom: availableFrom || '00:00',
      availableTo: availableTo || '23:59',
      pastPartners: pastPartners || [],
      // --- สิ้นสุด Field ใหม่ ---
    });
    const player = await newPlayer.save();
    res.status(201).send({ message: 'Player added successfully!', player });
  } catch (error) {
    console.error("Error adding player:", error);
    res.status(500).send({ message: 'Error adding player', error: error.message });
  }
};

// Get all players
exports.getPlayers = async (req, res) => {
  try {
    // Populate pastPartners เพื่อดึงข้อมูลชื่อ (ถ้าต้องการ) แต่สำหรับตอนนี้อาจจะไม่จำเป็น
    const players = await Player.find(); 
    res.status(200).send(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).send({ message: 'Error fetching players', error: error.message });
  }
};

// Get player by ID
exports.getPlayerById = async (req, res) => { // <--- เพิ่ม Method นี้
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).send({ message: 'Player not found' });
    }
    res.status(200).send({ player }); // ห่อด้วย object ชื่อ 'player' เพื่อให้สอดคล้องกับ Frontend
  } catch (error) {
    console.error("Error fetching player by ID:", error);
    res.status(500).send({ message: 'Error fetching player', error: error.message });
  }
};

// **ต้องเพิ่มฟังก์ชัน Update Player ด้วย!**
exports.updatePlayer = async (req, res) => {
  try {
    const { name, phoneNumber, skillLevel, gamesPlayed, availableFrom, availableTo, pastPartners } = req.body;
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).send({ message: 'Player not found' });
    }

    if (name !== undefined) player.name = name;
    if (phoneNumber !== undefined) player.phoneNumber = phoneNumber;
    if (skillLevel !== undefined) player.skillLevel = parseInt(skillLevel);
    // --- อัปเดต Field ใหม่ ---
    if (gamesPlayed !== undefined) player.gamesPlayed = gamesPlayed;
    if (availableFrom !== undefined) player.availableFrom = availableFrom;
    if (availableTo !== undefined) player.availableTo = availableTo;
    if (pastPartners !== undefined) player.pastPartners = pastPartners;
    // --- สิ้นสุด Field ใหม่ ---

    const updatedPlayer = await player.save();
    res.status(200).send({ message: 'Player updated successfully!', player: updatedPlayer });
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).send({ message: 'Error updating player', error: error.message });
  }
};