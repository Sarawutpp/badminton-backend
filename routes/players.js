const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.post('/', playerController.addPlayer);
router.post('/bulk', playerController.addMultiplePlayers);
router.get('/', playerController.getPlayers);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer); // --- [NEW] Route for deleting a player

module.exports = router;