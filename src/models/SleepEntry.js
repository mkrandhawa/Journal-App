import mongoose from 'mongoose';

const SleepEntrySchema = new mongoose.Schema({
      userId: {
        type: String, 
        required: [true, 'User ID is required'],
        index: true,
    },
    
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },

    hoursSlept: {
        type: Number,
        required: [true, 'Please enter hours slept'],
        min: 0,
        max: 24, 
    },
    targetHours: {
        type: Number,
        required: [true, 'Target hours is required'],
        default: 8
    },
    sleepQuality: {
        type: String,
        enum: ['Poor', 'Fair', 'Good', 'Excellent'],
        default: 'Good'
    },
    wakeMood: {
        type: String,
        enum: ['Tired', 'Okay', 'Refreshed', 'Energized'],
        default: 'Okay'
    },
    notes: {
        type: String,
        maxLength: 500,
        trim: true,
    },
    
}, { timestamps: true }); 

SleepEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.SleepEntry || mongoose.model('SleepEntry', SleepEntrySchema);