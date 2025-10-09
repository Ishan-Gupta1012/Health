import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Pill } from 'lucide-react';

const MedicineReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Medicine Reminders</h1>
          <p className="text-xl text-gray-600">Never miss a dose with smart medication tracking</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Reminders</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
              data-testid="add-reminder-btn"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No medicine reminders set up yet</p>
              <p className="text-sm">Add your first reminder to get started</p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="reminders-list">
              {/* Reminder items would go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineReminders;