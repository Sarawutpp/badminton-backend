// badminton_backend/controllers/playerController.js

const Player = require('../models/Player');

// Add a new player
exports.addPlayer = async (req, res) => {
  try {
    const { name, phoneNumber, skillLevel, gamesPlayed, availableFrom, availableTo, pastPartners } = req.body;
    if (!name || skillLevel === undefined) {
      return res.status(400).send({ message: 'Name and skill level are required.' });
    }
    const newPlayer = new Player({
      name,
      phoneNumber: phoneNumber || '',
      skillLevel: parseInt(skillLevel),
      gamesPlayed: gamesPlayed || 0,
      availableFrom: availableFrom || '00:00',
      availableTo: availableTo || '23:59',
      pastPartners: pastPartners || [],
    });
    const player = await newPlayer.save();
    res.status(201).send({ message: 'Player added successfully!', player });
  } catch (error) {
    console.error("Error adding player:", error);
    res.status(500).send({ message: 'Error adding player', error: error.message });
  }
};

// Add multiple players at once
exports.addMultiplePlayers = async (req, res) => {
    try {
        const playersData = req.body;
        if (!Array.isArray(playersData) || playersData.length === 0) {
            return res.status(400).send({ message: 'Player data must be a non-empty array.' });
        }
        
        const createdPlayers = await Player.insertMany(playersData);
        
        res.status(201).send({
            message: `${createdPlayers.length} players imported successfully!`,
            players: createdPlayers
        });
    } catch (error) {
        console.error("Error bulk adding players:", error);
        res.status(500).send({ message: 'Error bulk adding players', error: error.message });
    }
};


// Get all players
exports.getPlayers = async (req, res) => {
  try {
    const players = await Player.find(); 
    res.status(200).send(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).send({ message: 'Error fetching players', error: error.message });
  }
};

// Get player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).send({ message: 'Player not found' });
    }
    res.status(200).send({ player });
  } catch (error) {
    console.error("Error fetching player by ID:", error);
    res.status(500).send({ message: 'Error fetching player', error: error.message });
  }
};

// Update Player
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
    if (gamesPlayed !== undefined) player.gamesPlayed = gamesPlayed;
    if (availableFrom !== undefined) player.availableFrom = availableFrom;
    if (availableTo !== undefined) player.availableTo = availableTo;
    if (pastPartners !== undefined) player.pastPartners = pastPartners;

    const updatedPlayer = await player.save();
    res.status(200).send({ message: 'Player updated successfully!', player: updatedPlayer });
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).send({ message: 'Error updating player', error: error.message });
  }
};

// --- [NEW] Delete a player ---
exports.deletePlayer = async (req, res) => {
  try {
    // Note: This is a simple delete. In a more complex app, you might want to
    // check if the player is in an active session before deleting.
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).send({ message: 'Player not found' });
    }

    // Optional: You could also remove the player from all sessions here.
    // For now, we'll keep it simple.

    res.status(200).send({ message: 'Player deleted successfully!' });
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).send({ message: 'Error deleting player', error: error.message });
  }
};
