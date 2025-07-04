// badminton_backend/controllers/sessionController.js

const Session = require('../models/Session');
const Player = require('../models/Player');

// สร้าง Session
exports.createSession = async (req, res) => {
  try {
    const {
      playersPresent,
      paymentType,
      fixedCostPerPerson,
      costPerGameBreakdown,
      notes,
    } = req.body;

    if (!Array.isArray(playersPresent) || playersPresent.length === 0) {
      return res
        .status(400)
        .send({ message: 'At least one player must be present.' });
    }

    const newSession = new Session({
      playersPresent,
      paymentType,
      fixedCostPerPerson: fixedCostPerPerson || 0,
      notes: notes || '',
      costPerGameBreakdown: {
        courtCost: costPerGameBreakdown?.courtCost || 0,
        shuttlecockCostPerGame:
          costPerGameBreakdown?.shuttlecockCostPerGame || 0,
      },
      gamesPlayed: [],
      playerCosts: playersPresent.reduce((acc, playerId) => {
        acc[playerId] = { cost: 0, isPaid: false };
        return acc;
      }, {}),
    });

    const session = await newSession.save();
    const populatedSession = await Session.findById(session._id).populate(
      'playersPresent'
    );

    res
      .status(201)
      .send({
        message: 'Session created successfully!',
        session: populatedSession,
      });
  } catch (error) {
    console.error('Error creating session:', error);
    res
      .status(500)
      .send({ message: 'Error creating session', error: error.message });
  }
};

// ดึงข้อมูล Session ทั้งหมด
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate('playersPresent').sort({ date: -1 });
    res.status(200).send(sessions);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching sessions', error: error.message });
  }
};

// ดึงข้อมูล Session เดียวตาม ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('playersPresent');
    if (!session) {
      return res.status(404).send({ message: 'Session not found' });
    }
    res.status(200).send(session);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching session', error: error.message });
  }
};


// --- *** [MODIFIED] แก้ไขฟังก์ชันอัปเดต Session *** ---
exports.updateSession = async (req, res) => {
  try {
    const { 
        playersPresent, 
        gamesPlayed, 
        playerCosts,
        notes, 
        paymentType, 
        fixedCostPerPerson, 
        costPerGameBreakdown 
    } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).send({ message: 'Session not found' });
    }

    // อัปเดตข้อมูลตาม field ที่ส่งมา
    if (playersPresent !== undefined) session.playersPresent = playersPresent;
    if (gamesPlayed !== undefined) session.gamesPlayed = gamesPlayed;
    if (notes !== undefined) session.notes = notes;
    if (paymentType !== undefined) session.paymentType = paymentType;
    if (fixedCostPerPerson !== undefined) session.fixedCostPerPerson = fixedCostPerPerson;
    if (costPerGameBreakdown !== undefined) session.costPerGameBreakdown = costPerGameBreakdown;
    
    // --- *** [REVERTED] นำ Logic การลบผู้เล่นออกจาก playersPresent ออก *** ---
    // อัปเดตสถานะการจ่ายเงินเท่านั้น โดยไม่แก้ไข playersPresent
    if (playerCosts !== undefined) {
      session.playerCosts = playerCosts;
    }
    // --- ****************************************************** ---

    const updatedSession = await session.save();
    const populatedSession = await Session.findById(updatedSession._id).populate('playersPresent');

    res.status(200).send({ message: 'Session updated successfully!', session: populatedSession });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).send({ message: 'Error updating session', error: error.message });
  }
};


// ลบ Session
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).send({ message: 'Session not found' });
    }
    res.status(200).send({ message: 'Session deleted successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting session', error: error.message });
  }
};
