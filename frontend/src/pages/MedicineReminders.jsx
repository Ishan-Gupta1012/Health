import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Bell, Clock } from 'lucide-react';
import { apiService } from '../utils/api';

const MedicineReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [error, setError] = useState('');

  const fetchReminders = async () => {
    try {
      const response = await apiService.reminders.getReminders();
      // The backend returns an object with a 'reminders' array
      setReminders(response.data.reminders);
    } catch (error) {
      console.error('Failed to fetch reminders', error);
      setError('Could not fetch reminders.');
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!medicineName || !dosage || !time) {
      setError('Please fill out all fields.');
      return;
    }

    const newReminder = {
      medicineName,
      dosage: {
        amount: dosage.replace(/\D/g, '') || '1', // Extracts numbers from dosage, defaults to 1
        unit: dosage.replace(/[0-9]/g, '').trim() || 'tablet', // Extracts units, defaults to 'tablet'
      },
      frequency: {
        timesPerDay: 1, // This can be expanded upon if needed
        times: [time],
      },
      duration: {
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Sets a default 30-day duration
      },
    };

    try {
      await apiService.reminders.createReminder(newReminder);
      // Clear form and refetch reminders to show the new one
      setMedicineName('');
      setDosage('');
      setTime('');
      setError('');
      fetchReminders();
    } catch (error) {
      console.error('Failed to add reminder', error);
      setError('Failed to add reminder. Please try again.');
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await apiService.reminders.deleteReminder(reminderId);
        // Update the UI instantly by filtering out the deleted reminder
        setReminders(reminders.filter(r => r.reminderId !== reminderId));
      } catch (error) {
        console.error('Failed to delete reminder', error);
        setError('Failed to delete reminder. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8"
        >
          <div className="text-center mb-8">
            <Bell className="mx-auto h-12 w-12 text-black" />
            <h1 className="text-3xl font-bold text-black mt-4">Medication Reminder</h1>
            <p className="text-black/80">Stay on top of your health regimen.</p>
          </div>

          <form onSubmit={handleAddReminder} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Medication Name</label>
                <input required type="text" placeholder="e.g., Paracetamol" className="input" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Dosage</label>
                <input required type="text" placeholder="e.g., 500mg or 1 tablet" className="input" value={dosage} onChange={(e) => setDosage(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Reminder Time</label>
                <input required type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Frequency</label>
                <select className="input" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  <option>Daily</option>
                  <option>Twice a day</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="btn-primary w-full py-3 text-lg">Add Reminder</button>
          </form>

          <div className="mt-8">
            <h2 className="font-semibold text-black mb-4">Existing Reminders</h2>
            <div className="space-y-3">
              {reminders && reminders.length > 0 ? reminders.map((reminder) => (
                <div key={reminder.reminderId} className="bg-white/20 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-black">{reminder.medicineName}</p>
                    <p className="text-sm text-black/80">{`${reminder.dosage.amount}${reminder.dosage.unit} - ${reminder.frequency.times.join(', ')}`}</p>
                  </div>
                  <button onClick={() => handleDeleteReminder(reminder.reminderId)} className="p-2 text-red-500/70 hover:bg-red-500/10 hover:text-red-600 rounded-full">
                    <Trash2 size={20} />
                  </button>
                </div>
              )) : <p className="text-center text-black/70">No reminders added yet.</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MedicineReminders;