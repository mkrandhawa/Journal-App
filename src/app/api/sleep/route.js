import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth"; 
import dbConnect from '@/lib/mongodb';
import SleepEntry from '@/models/SleepEntry';
import { authOptions } from '@/lib/auth';


export async function GET(request) {
    await dbConnect();

    try{
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
        }
        
        const userId = session.user.id;

        const sleepEntries = await SleepEntry.find({ userId }).sort({ date: -1 }).limit(10).lean();

        return NextResponse.json({ 
            message: 'Sleep entries retrieved successfully.', 
            data: sleepEntries 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            message: 'Failed to retrieve sleep entries.', 
            error: error.message 
        }, { status: 500 });
    }
}


// ---------------------------------------------------------------------
// POST handler (CREATE a new Sleep Entry)
// ---------------------------------------------------------------------
export async function POST(request) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
        }
        
        const userId = session.user.id; 
        
        const body = await request.json();

        const newEntry = await SleepEntry.create({
            ...body, 
            userId: userId, 
            date: body.date ? new Date(body.date) : Date.now(), 
        });

        return NextResponse.json({ 
            message: 'Sleep entry successfully created.', 
            data: newEntry 
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ 
            message: 'Failed to create sleep entry.', 
            error: error.message 
        }, { status: 400 });
    }
}
