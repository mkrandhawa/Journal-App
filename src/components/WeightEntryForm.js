'use client';
import { useState, useEffect } from 'react';
import { 
    ScaleIcon, 
    CalendarDaysIcon, 
    FlagIcon, 
    UserIcon, 
    ChatBubbleLeftEllipsisIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import InputField from './inputFields';

const today = new Date().toISOString().split('T')[0];

export default function WeightEntryForm({ onEntryCreated, lastEntry }) {
    const [formData, setFormData] = useState({
        weight: '',
        targetWeight: '',
        date: today,
        weightTime: 'Morning',
        height: '',
        age: '',
        sex: 'Female', 
        notes: ''
    });

    useEffect(() => {
        if (lastEntry) {
            setFormData(prev => ({
                ...prev,
                targetWeight: lastEntry.targetWeight ?? '',
                height: lastEntry.height ?? '',
                age: lastEntry.age ?? '',
                sex: lastEntry.sex ?? 'Female',
                date: today
            }));
        }
    }, [lastEntry]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); 


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleManualSelect = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        if (formData.date > today) {
            setMessage({ type: 'error', text: 'Date cannot be in the future.' });
            setLoading(false);
            return;
        }


        const weightNum = parseFloat(formData.weight);
        const heightCm = parseFloat(formData.height);
        
        let bmiCalc = null;
        if (weightNum && heightCm) {
            const heightMeters = heightCm / 100;
            bmiCalc = parseFloat((weightNum / (heightMeters * heightMeters)).toFixed(1));
        }
        
       
        const payload = {
            ...formData,
            weight: weightNum,
            targetWeight: parseFloat(formData.targetWeight),
            height: heightCm || null,
            age: parseInt(formData.age) || null,
            BMI: bmiCalc,
            date: new Date(formData.date)
        };

        try {
            const res = await fetch('/api/weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                onEntryCreated(data.data);
                setMessage({ type: 'success', text: 'Entry successfully logged! Check your history below.' });

                setFormData(prev => ({ ...prev, weight: '', notes: '' }));
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });

        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-indigo-900 tracking-tight">Log Progress</h2>
                    <p className="text-indigo-500 text-sm font-medium">Every gram counts towards the goal.</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-2xl">
                    <SparklesIcon className="w-6 h-6 text-indigo-600" />
                </div>
            </div>

            {/* --- SECTION 1: THE CORE METRICS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-[2rem] border border-indigo-100 shadow-sm">
                <InputField 
                    label="Current Weight (kg)" 
                    name="weight" 
                    type="text" 
                    inputMode="decimal" 
                    value={formData.weight ?? ''} 
                    onChange={handleChange} 
                    placeholder="00.0" 
                    icon={ScaleIcon} 
                    required 
                />
                <InputField 
                    label="Target (kg)" 
                    name="targetWeight" 
                    type="text" 
                    inputMode="decimal" 
                    value={formData.targetWeight ?? ''} 
                    onChange={handleChange} 
                    icon={FlagIcon} 
                    required 
                />
            </div>

            {/* --- SECTION 2 --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Time of Day</label>
                    <div className="flex p-1 bg-gray-100 rounded-2xl">
                        {['Morning', 'Afternoon', 'Evening'].map((time) => (
                            <button
                                key={time}
                                type="button"
                                onClick={() => handleManualSelect('weightTime', time)}
                                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                                    formData.weightTime === time 
                                    ? 'bg-white text-indigo-600 shadow-sm' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                <InputField 
                    label="Log Date" 
                    name="date" 
                    type="date" 
                    value={formData.date ?? ''} 
                    onChange={handleChange} 
                    max={today} 
                    icon={CalendarDaysIcon} 
                />
            </div>

            {/* --- SECTION 3: PERSONAL SPECS --- */}
            <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-indigo-50/50">
                <div className="flex items-center gap-2 mb-6">
                    <UserIcon className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Personal Profile</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Height (cm)" name="height" type="text" value={formData.height ?? ''} onChange={handleChange} placeholder="170" />
                    <InputField label="Age" name="age" type="text" value={formData.age ?? ''} onChange={handleChange} placeholder="25" />
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 ml-1">Sex</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Male', 'Female'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => handleManualSelect('sex', s)}
                                    className={`py-3 px-2 rounded-xl border text-sm font-bold transition-all ${
                                        formData.sex === s 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 4: NOTES --- */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">
                    <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                    Reflections
                </label>
                <textarea 
                    name="notes" 
                    value={formData.notes ?? ''} 
                    onChange={handleChange} 
                    placeholder="How does your body feel today?" 
                    className="w-full p-5 bg-gray-50 border-none rounded-[2rem] h-32 text-gray-700 focus:ring-2 focus:ring-indigo-200 transition-all placeholder:text-gray-300" 
                />
            </div>

            <div>
                {message && (
                    <div className={`p-3 mb-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}
                <button 
                    type="submit" 
                    disabled={loading} 
                    className={`w-full py-5 text-white font-black rounded-[2rem] transition-all duration-300 shadow-xl active:scale-[0.98] ${
                        loading 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300'
                    }`}
                >
                    {loading ? 'Processing...' : 'Sync New Weight Entry'}
                </button>
            </div>
        </form>
    );
}