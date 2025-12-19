'use client';
import { useState } from 'react';
import { 
    PlusIcon, 
    BeakerIcon, 
    CheckCircleIcon, 
    ExclamationCircleIcon,
    ChevronUpIcon,
    FlagIcon
} from '@heroicons/react/24/outline';
import InputField from './inputFields';

export default function WaterEntryForm({ onEntryCreated, currentEntry }) {
    const [targetAmount, setTargetAmount] = useState(currentEntry?.targetMl || 2000);
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleAddWater = async (ml) => {
        setLoading(true);
        try {
            const res = await fetch('/api/water', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    amountMl: ml, 
                    targetMl: targetAmount
                })
            });
            const data = await res.json();
            if (res.ok) {
                onEntryCreated(data.data);
                setMessage({ type: 'success', text: `Added ${ml}ml!` });
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to sync water.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (!customAmount || customAmount <= 0) return;
        handleAddWater(parseFloat(customAmount));
        setCustomAmount('');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-50 rounded-xl">
                        <BeakerIcon className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Hydration Lab</h3>
                </div>

                {message && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold animate-in zoom-in duration-300 ${
                        message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-cyan-50 text-cyan-600'
                    }`}>
                        {message.type === 'error' ? <ExclamationCircleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}
            </div>

            <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100/50">
                 <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                        <InputField 
                            label="Daily Hydration Goal (ml)" 
                            name="targetMl" 
                            type="number" 
                            value={targetAmount} 
                            onChange={(e) => setTargetAmount(e.target.value)} 
                            placeholder="e.g. 2000" 
                            icon={FlagIcon} 
                        />
                    </div>
                    <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed italic">
                        Adjust your daily target. Most adults need between 2000ml and 3000ml.
                    </p>
                 </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-4">Quick Add</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Glass', amount: 250, icon: '💧' },
                        { label: 'Bottle', amount: 500, icon: '💧💧' },
                        { label: 'Large', amount: 750, icon: '💧💧💧' }
                    ].map((item) => (
                        <button
                            key={item.amount}
                            disabled={loading}
                            onClick={() => handleAddWater(item.amount)}
                            className="group relative overflow-hidden bg-white hover:bg-cyan-50 border-2 border-slate-50 hover:border-cyan-100 p-6 rounded-[2.5rem] transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                            <span className="block text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="block text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-cyan-600">{item.label}</span>
                            <span className="block text-lg font-black text-slate-700 group-hover:text-cyan-700">{item.amount}ml</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CUSTOM MANUAL ENTRY --- */}
            <form onSubmit={handleCustomSubmit} className="relative">
                <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-slate-100 focus-within:border-cyan-200 focus-within:ring-4 focus-within:ring-cyan-50 transition-all shadow-sm">
                    <div className="pl-4 text-slate-400">
                        <PlusIcon className="w-5 h-5" />
                    </div>
                    <input 
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Add custom amount..."
                        className="bg-transparent border-none focus:ring-0 flex-1 py-3 text-slate-700 font-bold placeholder:text-slate-300"
                    />
                    <button 
                        type="submit"
                        disabled={loading || !customAmount}
                        className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-black transition-all disabled:bg-slate-300"
                    >
                        <ChevronUpIcon className="w-5 h-5 stroke-[3px]" />
                    </button>
                </div>
            </form>
        </div>
    );
}