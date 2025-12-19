import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth"; 
import dbConnect from '@/lib/mongodb';
import WaterEntry from '@/models/WaterEntry';
import { authOptions } from '@/lib/auth';


export async function GET(request) {
    await dbConnect();

    try{
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
        }
        
        const userId = session.user.id;

        const waterEntries = await WaterEntry.find({ userId }).sort({ date: -1 }).limit(10).lean();

        return NextResponse.json({ 
            message: 'Water entries retrieved successfully.', 
            data: waterEntries 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            message: 'Failed to retrieve water entries.', 
            error: error.message 
        }, { status: 500 });
    }
}


// ---------------------------------------------------------------------
// POST handler (CREATE a new Water Entry)
// ---------------------------------------------------------------------
export async function POST(request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
        }
        
        const userId = session.user.id; 
        
       const { amountMl, targetMl, date } = await request.json();

       
        const logDate = date ? new Date(date) : new Date();
        const todayStart = new Date(logDate.setHours(0, 0, 0, 0));

        const updatedEntry = await WaterEntry.findOneAndUpdate(
            { 
                userId: userId, 
                date: todayStart 
            },
            { 
                $inc: { amountMl: amountMl },
                $set: { targetMl: targetMl }  
            },
            { 
                upsert: true, // if it doesn't exist, create it
                new: true     
            }
        );

    return NextResponse.json({ 
        message: 'Water entry successfully created.', 
        data: updatedEntry 
    }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ 
            message: 'Failed to create water entry.', 
            error: error.message 
        }, { status: 400 });
    }
}
