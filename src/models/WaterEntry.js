import mongoose from 'mongoose';

const WaterEntrySchema = new mongoose.Schema({
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
    amountMl: {
        type: Number,
        required: [true, 'Please enter water amount'],
        min: 0,
        default: 0
    },
    targetMl: {
        type: Number,
        required: [true, 'Target intake is required'],
        default: 2000 
    },

    notes: {
        type: String,
        maxLength: 500,
        trim: true,
    },
    
}, { timestamps: true }); 

WaterEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.WaterEntry || mongoose.model('WaterEntry', WaterEntrySchema);