import mongoose from 'mongoose';

const DietEntrySchema = new mongoose.Schema({
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

    caloriesConsumed: {
        type: Number,
        required: [true, 'Calories consumed is required'],
        min: 0,
    },
    
    targetCalories: {
        type: Number,
        required: [true, 'Target calories are required'],
        min: 1000,
    },

    proteinGrams: {
        type: Number,
        default: 0,
    },
    carbsGrams: {
        type: Number,
        default: 0,
    },
    fatGrams: {
        type: Number,
        default: 0,
    },

    notes: {
        type: String,
        maxLength: 500,
        trim: true,
    },
    
}, { timestamps: true }); 

export default mongoose.models.DietEntry || mongoose.model('DietEntry', DietEntrySchema);
