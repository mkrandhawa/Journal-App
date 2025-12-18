'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function WeightChart({ history }) {
    // Reverse data to show oldest to newest for the chart line
    const chartData = [...history].reverse().map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: entry.weight,
        target: entry.targetWeight
    }));

    return (
        <div className="h-[300px] w-full mt-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
                    {/* Goal Line */}
                    <ReferenceLine y={chartData[0]?.target} label="Goal" stroke="red" strokeDasharray="3 3" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}