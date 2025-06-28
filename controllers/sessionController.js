// badminton_backend/controllers/sessionController.js

const Session = require('../models/Session');
const Player = require('../models/Player'); // เพื่อใช้ populate ข้อมูลผู้เล่น

// สร้าง Session ใหม่
exports.createSession = async (req, res) => {
  try {
    const { date, playersPresent } = req.body; // playersPresent จะเป็น Array ของ Player IDs

    // ตรวจสอบว่า playersPresent เป็น Array และไม่ว่างเปล่า
    if (!Array.isArray(playersPresent) || playersPresent.length === 0) {
        return res.status(400).send({ message: 'At least one player must be present to create a session.' });
    }

    const newSession = new Session({
      date: date ? new Date(date) : Date.now(),
      playersPresent: playersPresent,
      gamesPlayed: [],
      totalCost: 0,
      playerCosts: {},
      notes: '',
    });

    const session = await newSession.save();

    // Populate ผู้เล่นที่มาเพื่อส่งกลับไปให้ Frontend เห็นชื่อ
    const populatedSession = await Session.findById(session._id).populate('playersPresent', 'name skillLevel');

    res.status(201).send({ message: 'Session created successfully!', session: populatedSession });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).send({ message: 'Error creating session', error: error.message });
  }
};

// ดึงข้อมูล Session ทั้งหมด
exports.getSessions = async (req, res) => {
  try {
    // ดึง Session ทั้งหมด และ populate ข้อมูลผู้เล่นที่มา
    const sessions = await Session.find().populate('playersPresent', 'name skillLevel').sort({ date: -1 });
    res.status(200).send(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).send({ message: 'Error fetching sessions', error: error.message });
  }
};

// ดึงข้อมูล Session เดียวตาม ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('playersPresent', 'name skillLevel');
    if (!session) {
      return res.status(404).send({ message: 'Session not found' });
    }
    res.status(200).send(session);
  } catch (error) {
    console.error("Error fetching session by ID:", error);
    res.status(500).send({ message: 'Error fetching session', error: error.message });
  }
};

// อัปเดตข้อมูล Session (เช่น บันทึกเกมที่เล่น, ค่าใช้จ่าย)
exports.updateSession = async (req, res) => {
  try {
    const { gamesPlayed, totalCost, playerCosts, notes } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).send({ message: 'Session not found' });
    }

    if (gamesPlayed !== undefined) session.gamesPlayed = gamesPlayed;
    if (totalCost !== undefined) session.totalCost = totalCost;
    if (playerCosts !== undefined) session.playerCosts = playerCosts;
    if (notes !== undefined) session.notes = notes;

    const updatedSession = await session.save();
    const populatedSession = await Session.findById(updatedSession._id).populate('playersPresent', 'name skillLevel');

    res.status(200).send({ message: 'Session updated successfully!', session: populatedSession });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).send({ message: 'Error updating session', error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).send({ message: 'Session not found' });
    }
    res.status(200).send({ message: 'Session deleted successfully!', session });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).send({ message: 'Error deleting session', error: error.message });
  }
};

// (ในอนาคต อาจมี deleteSession)