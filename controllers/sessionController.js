const Session = require('../models/Session');

// สร้าง Session
exports.createSession = async (req, res) => {
  try {
    const {
      playerIds, // Changed from playersPresent for clarity
      zone,
      paymentType,
      fixedCostPerPerson,
      costPerGameBreakdown,
      notes,
      courtLabels,
    } = req.body;

    if (!Array.isArray(playerIds) || playerIds.length === 0) {
      return res
        .status(400)
        .send({ message: 'At least one player must be present.' });
    }
    if (!zone) {
      return res.status(400).send({ message: 'Zone is required.' });
    }

    // --- [NEW] Create initial activity logs for all players ---
    const now = new Date();
    const initialActivityLogs = playerIds.map(id => ({
      playerId: id,
      status: 'WAITING',
      timestamp: now,
    }));

    const newSession = new Session({
      playersPresent: playerIds,
      zone,
      paymentType,
      fixedCostPerPerson: fixedCostPerPerson || 0,
      notes: notes || '',
      courtLabels: courtLabels && courtLabels.length > 0 ? courtLabels : ['1','2','3','4','5','6'],
      costPerGameBreakdown: {
        courtCost: costPerGameBreakdown?.courtCost || 0,
        shuttlecockCostPerGame:
          costPerGameBreakdown?.shuttlecockCostPerGame || 0,
      },
      gamesPlayed: [],
      // --- [NEW] Add initial logs to the new session ---
      activityLogs: initialActivityLogs,
      playerCosts: playerIds.reduce((acc, playerId) => {
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
      .send(populatedSession); // Return the full session object
  } catch (error) {
    console.error('Error creating session:', error);
    res
      .status(500)
      .send({ message: 'Error creating session', error: error.message });
  }
};

// อัปเดต Session
exports.updateSession = async (req, res) => {
  try {
    const { 
        playersPresent, 
        gamesPlayed, 
        playerCosts,
        notes, 
        paymentType, 
        fixedCostPerPerson, 
        costPerGameBreakdown,
        buddyPairs,
        zone,
        courtLabels,
        activityLogs, // --- [NEW] Receive activityLogs from client ---
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
    if (playerCosts !== undefined) session.playerCosts = playerCosts;
    if (buddyPairs !== undefined) session.buddyPairs = buddyPairs;
    if (zone !== undefined) session.zone = zone;
    if (courtLabels !== undefined) session.courtLabels = courtLabels;
    // --- [NEW] Update activityLogs if provided ---
    if (activityLogs !== undefined) session.activityLogs = activityLogs;

    const updatedSession = await session.save();
    const populatedSession = await Session.findById(updatedSession._id).populate('playersPresent');

    res.status(200).send(populatedSession); // Return the full updated session
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).send({ message: 'Error updating session', error: error.message });
  }
};


// --- (Other functions like getSessions, deleteSession, etc. remain the same) ---
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate('playersPresent').sort({ date: -1 });
    res.status(200).send(sessions);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching sessions', error: error.message });
  }
};
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
