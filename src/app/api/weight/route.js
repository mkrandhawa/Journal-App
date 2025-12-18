import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth"; 
import dbConnect from '@/lib/mongodb';
import WeightEntry from '@/models/WeightEntry';
import { authOptions } from '@/lib/auth';


export async function GET(request) {
    await dbConnect();

    try{
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
        }
        
        const userId = session.user.id;

        const weightEntries = await WeightEntry.find({ userId }).sort({ date: -1 }).limit(10).lean();

        return NextResponse.json({ 
            message: 'Weight entries retrieved successfully.', 
            data: weightEntries 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            message: 'Failed to retrieve weight entries.', 
            error: error.message 
        }, { status: 500 });
    }
}


// ---------------------------------------------------------------------
// POST handler (CREATE a new WeightEntry)
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

        const newEntry = await WeightEntry.create({
            ...body, 
            userId: userId, 
            date: body.date ? new Date(body.date) : Date.now(), 
        });

        return NextResponse.json({ 
            message: 'Weight entry successfully created.', 
            data: newEntry 
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ 
            message: 'Failed to create weight entry.', 
            error: error.message 
        }, { status: 400 });
    }
}
