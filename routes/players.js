// badminton_backend/routes/players.js

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.post('/', playerController.addPlayer);
router.get('/', playerController.getPlayers);
router.get('/:id', playerController.getPlayerById); // ดึงผู้เล่นโดย ID
router.put('/:id', playerController.updatePlayer); // อัปเดตผู้เล่น
// router.delete('/:id', playerController.deletePlayer); // ถ้ามี delete player ก็เอาไว้ตรงนี้

module.exports = router;