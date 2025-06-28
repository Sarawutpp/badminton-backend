// badminton_backend/routes/sessions.js

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/', sessionController.createSession); // สร้าง Session
router.get('/', sessionController.getSessions);     // ดึง Sessions ทั้งหมด
router.get('/:id', sessionController.getSessionById); // ดึง Session เดียว
router.put('/:id', sessionController.updateSession); // อัปเดต Session
router.delete('/:id', sessionController.deleteSession); // ลบ Session

module.exports = router;