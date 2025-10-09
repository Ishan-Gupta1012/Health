const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  recordId: {
    type: String,
    unique: true,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['prescription', 'lab_report', 'xray', 'scan', 'document', 'other']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  files: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  doctorName: {
    type: String,
    default: ''
  },
  hospitalName: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  tags: [String],
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    email: String,
    sharedDate: Date,
    accessType: {
      type: String,
      enum: ['view', 'edit'],
      default: 'view'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);