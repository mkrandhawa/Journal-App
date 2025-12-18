import mongoose from 'mongoose';

const WeightEntrySchema = new mongoose.Schema({
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

    weight: {
        type: Number,
        required: [true, 'Please enter your weight'],
        min: 0,
    },
    
    targetWeight: {
        type: Number,
        required: [true, 'Target weight is required'],
        default: 0
    },
    BMI: {
        type: Number,
        default: null,
        min: 0,
    },
    wieghtTime:{
        type: String,
        default: 'Morning',
        enum: ['Morning', 'Afternoon', 'Evening']
    },
    unit:{
        type: String,
        default: 'kg',
        enum: ['lbs', 'kg']
    },
    height:{
        type: Number,
        default: null,
        min: 0,
        
    },
    age:{
        type: Number,
        default: null,
        min: 0,
    },
    sex:{
        type: String,
        default: null,
        enum: ['Male', 'Female']
    },
    notes: {
        type: String,
        maxLength: 500,
        trim: true,
    },
    
}, { timestamps: true }); 

WeightEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.WeightEntry || mongoose.model('WeightEntry', WeightEntrySchema);
