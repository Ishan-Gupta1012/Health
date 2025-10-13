const express = require('express');
const Reminder = require('../models/Reminder');
const { verifyToken } = require('./auth');
const router = express.Router();

// Create new reminder
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      medicineName,
      dosage,
      frequency,
      duration,
      instructions,
      beforeFood,
      afterFood
    } = req.body;

    if (!medicineName || !dosage || !frequency || !duration) {
      return res.status(400).json({
        message: 'Medicine name, dosage, frequency, and duration are required'
      });
    }

    const reminder = new Reminder({
      userId: req.userId,
      medicineName,
      dosage,
      frequency,
      duration,
      instructions,
      beforeFood,
      afterFood
    });

    await reminder.save();

    res.status(201).json({
      message: 'Medicine reminder created successfully',
      reminder
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: 'Failed to create reminder', error: error.message });
  }
});

// Get user's reminders
router.get('/', verifyToken, async (req, res) => {
  try {
    const { active, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.userId };
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const reminders = await Reminder.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reminder.countDocuments(query);

    // Get today's reminders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysReminders = await Reminder.find({
      userId: req.userId,
      isActive: true,
      'duration.startDate': { $lte: today },
      'duration.endDate': { $gte: today }
    });

    res.json({
      reminders,
      todaysReminders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reminders', error: error.message });
  }
});

// Get reminder by ID
router.get('/:reminderId', verifyToken, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      reminderId: req.params.reminderId,
      userId: req.userId
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ reminder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reminder', error: error.message });
  }
});

// Update reminder
router.put('/:reminderId', verifyToken, async (req, res) => {
  try {
    const updates = req.body;

    const reminder = await Reminder.findOneAndUpdate(
      { reminderId: req.params.reminderId, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({
      message: 'Reminder updated successfully',
      reminder
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update reminder', error: error.message });
  }
});

// Mark dose as taken
router.post('/:reminderId/dose', verifyToken, async (req, res) => {
  try {
    const { date, time, taken = true } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required' });
    }

    const reminder = await Reminder.findOne({
      reminderId: req.params.reminderId,
      userId: req.userId
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Check if dose already recorded for this date/time
    const existingDoseIndex = reminder.completedDoses.findIndex(
      dose => dose.date.toDateString() === new Date(date).toDateString() && dose.time === time
    );

    if (existingDoseIndex >= 0) {
      reminder.completedDoses[existingDoseIndex].taken = taken;
    } else {
      reminder.completedDoses.push({
        date: new Date(date),
        time,
        taken
      });
    }

    await reminder.save();

    res.json({
      message: `Dose marked as ${taken ? 'taken' : 'missed'}`,
      reminder
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update dose', error: error.message });
  }
});

// --- NEW DELETE ROUTE ---
// Deletes a medical reminder by its ID
router.delete('/:reminderId', verifyToken, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      reminderId: req.params.reminderId,
      userId: req.userId // Ensures users can only delete their own reminders
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found or you do not have permission to delete it.' });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({ message: 'Failed to delete reminder', error: error.message });
  }
});

// Get reminder statistics
router.get('/stats/overview', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Total reminders
    const totalReminders = await Reminder.countDocuments({ userId });
    const activeReminders = await Reminder.countDocuments({ userId, isActive: true });

    // This week's adherence
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const weeklyDoses = await Reminder.aggregate([
      { $match: { userId } },
      { $unwind: '$completedDoses' },
      { $match: { 'completedDoses.date': { $gte: weekStart } } },
      {
        $group: {
          _id: null,
          totalDoses: { $sum: 1 },
          takenDoses: { $sum: { $cond: ['$completedDoses.taken', 1, 0] } }
        }
      }
    ]);

    const adherenceRate = weeklyDoses.length > 0
      ? Math.round((weeklyDoses[0].takenDoses / weeklyDoses[0].totalDoses) * 100)
      : 0;

    res.json({
      totalReminders,
      activeReminders,
      weeklyAdherence: adherenceRate,
      weeklyDoses: weeklyDoses.length > 0 ? weeklyDoses[0] : { totalDoses: 0, takenDoses: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

module.exports = router;