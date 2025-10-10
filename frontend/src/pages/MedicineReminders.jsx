import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, Trash2, Bell } from 'lucide-react';

const MedicineReminders = () => {
  const [reminders, setReminders] = useState([
    { name: 'Ibuprofen', details: '200mg - 08:00 AM, Daily' },
    { name: 'Metformin', details: '500mg - 09:00 PM, Twice a day' },
  ]);

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

                <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Medication Name</label>
                            <input type="text" placeholder="e.g., Paracetamol" className="input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Dosage</label>
                            <input type="text" placeholder="e.g., 500mg" className="input" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-black mb-2">Reminder Time</label>
                            <input type="text" placeholder="--:-- --" className="input pr-10" />
                            <Clock className="absolute right-3 top-10 -translate-y-1/2 h-5 w-5 text-black/50" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">Frequency</label>
                            <select className="input">
                                <option>Daily</option>
                                <option>Twice a day</option>
                                <option>Weekly</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button className="btn-primary w-full py-3 text-lg">Add Reminder</button>

                <div className="mt-8">
                    <h2 className="font-semibold text-black mb-4">Existing Reminders</h2>
                    <div className="space-y-3">
                        {reminders.map((reminder, index) => (
                            <div key={index} className="bg-white/20 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-black">{reminder.name}</p>
                                    <p className="text-sm text-black/80">{reminder.details}</p>
                                </div>
                                <button className="text-black/50 hover:text-red-500">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
  );
};

export default MedicineReminders;
