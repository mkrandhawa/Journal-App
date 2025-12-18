'use client';
import { useState } from 'react';
import { 
    MoonIcon, 
    ClockIcon, 
    FlagIcon, 
    ExclamationCircleIcon,
    CheckCircleIcon 
} from '@heroicons/react/24/outline';
import InputField from './inputFields';

const today = new Date().toISOString().split('T')[0];

export default function SleepEntryForm({ onEntryCreated }) {
    const [formData, setFormData] = useState({
        date: today,
        hoursSlept: '',
        targetHours: 8,
        sleepQuality: 'Good',
        wakeMood: 'Okay',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (message) setMessage(null); // Clear message when user types
    };

    const handleSelect = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.date > today) {
            setMessage({ type: 'error', text: 'You cannot log sleep for a future date.' });
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            hoursSlept: parseFloat(formData.hoursSlept),
            targetHours: parseFloat(formData.targetHours),
            date: new Date(formData.date)
        };

        try {
            const res = await fetch('/api/sleep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            
            if (res.ok) {
                onEntryCreated(data.data);
                setMessage({ type: 'success', text: 'Rest successfully synced to the lab.' });
                // Reset core fields but keep the target for next time
                setFormData(prev => ({ ...prev, hoursSlept: '', notes: '' }));
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save entry.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            
            {/* --- FORM HEADER & MESSAGE --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                        <MoonIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Log Last Night</h3>
                </div>

                {/* Inline Messaging System */}
                {message && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold animate-in slide-in-from-right-4 duration-300 ${
                        message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                        {message.type === 'error' ? <ExclamationCircleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}
            </div>

            {/* --- PRIMARY INPUTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField 
                    label="Date of Wake Up" 
                    name="date" 
                    type="date" 
                    value={formData.date} 
                    onChange={handleChange} 
                    max={today} 
                    icon={ClockIcon} 
                />
                <InputField 
                    label="Hours Slept" 
                    name="hoursSlept" 
                    type="number" 
                    step="0.5" 
                    value={formData.hoursSlept} 
                    onChange={handleChange} 
                    placeholder="e.g. 7.5" 
                    icon={MoonIcon} 
                    required 
                />
                <InputField 
                    label="Sleep Goal" 
                    name="targetHours" 
                    type="number" 
                    step="0.5" 
                    value={formData.targetHours} 
                    onChange={handleChange} 
                    placeholder="8" 
                    icon={FlagIcon} 
                    required 
                />
            </div>

            {/* Quality Selector */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Sleep Quality</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Poor', 'Fair', 'Good', 'Excellent'].map((q) => (
                        <button
                            key={q}
                            type="button"
                            onClick={() => handleSelect('sleepQuality', q)}
                            className={`py-3 rounded-2xl border-2 text-sm font-bold transition-all duration-200 ${
                                formData.sleepQuality === q 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                                : 'border-slate-50 text-slate-400 hover:border-slate-100'
                            }`}
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mood Selector */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Wake Up Mood</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Tired', 'Okay', 'Refreshed', 'Energized'].map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => handleSelect('wakeMood', m)}
                            className={`py-3 rounded-2xl border-2 text-sm font-bold transition-all duration-200 ${
                                formData.wakeMood === m 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                                : 'border-slate-50 text-slate-400 hover:border-slate-100'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
                 <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Dream Journal / Notes</label>
                 <textarea 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange} 
                    placeholder="Any specific dreams or reasons for poor sleep?" 
                    className="w-full p-4 bg-slate-50 border-none rounded-3xl h-24 text-slate-600 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
                />
            </div>

            <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-5 bg-slate-900 text-white font-black rounded-[2.5rem] hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:bg-slate-400"
            >
                {loading ? 'Processing...' : 'Sync to Sleep Lab'}
            </button>
        </form>
    );
}