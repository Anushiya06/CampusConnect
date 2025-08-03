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
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  purpose: {
    type: String,
    required: true,
    enum: [
      'Student Visit', 
      'Alumni Visit', 
      'Faculty Meeting', 
      'Campus Tour', 
      'Seminar/Workshop',
      'Event Attendance', 
      'Job Interview', 
      'Research', 
      'Administrative',
      'Other'
    ]
  },
  category: {
    type: String,
    required: false,
    enum: [
      'Academic',
      'Social',
      'Professional',
      'Cultural',
      'Sports',
      'Technology',
      'Arts',
      'Community Service',
      'Other'
    ]
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