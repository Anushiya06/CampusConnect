import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  purpose: {
    type: String,
    required: true,
    enum: ['Student Visit', 'Faculty Meeting', 'Campus Tour', 'Event Attendance', 'Job Interview', 'Research', 'Other']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);