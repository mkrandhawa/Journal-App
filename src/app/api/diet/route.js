import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth"; 
import dbConnect from '@/lib/mongodb';
import DietEntry from '@/models/DietEntry';
import { authOptions } from '@/lib/auth';

// ---------------------------------------------------------------------
// GET handler (Placeholder: Used for reading data, we'll implement this later)
// ---------------------------------------------------------------------
export async function GET(request) {
    // We will implement reading the entries for the user here in Phase 7
    await dbConnect();

    try{
        // 1. SECURELY GET THE USER ID FROM THE SERVER SESSION
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
        }
        
        const userId = session.user.id;

        // 2. FETCH DIET ENTRIES FOR THE AUTHENTICATED USER
        const dietEntried = await DietEntry.find({ userId }).sort({ date: -1 }).limit(10).lean();

        // 3. RETURN THE ENTRIES
        return NextResponse.json({ 
            message: 'Diet entries retrieved successfully.', 
            data: dietEntried 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            message: 'Failed to retrieve diet entries.', 
            error: error.message 
        }, { status: 500 });
    }
}


// ---------------------------------------------------------------------
// POST handler (CREATE a new DietEntry)
// ---------------------------------------------------------------------
export async function POST(request) {
    await dbConnect();

    try {
        // 1. SECURELY GET THE USER ID FROM THE SERVER SESSION
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
        }
        
        // The unique ID from NextAuth/Google
        const userId = session.user.id; 
        
        // 2. GET THE DATA FROM THE REQUEST BODY
        const body = await request.json();

        // 3. VALIDATE DATA AND ATTACH USER ID
        const newEntry = await DietEntry.create({
            ...body, 
            userId: userId, 
            date: body.date ? new Date(body.date) : Date.now(), 
        });

        return NextResponse.json({ 
            message: 'Diet entry successfully created.', 
            data: newEntry 
        }, { status: 201 });

    } catch (error) {
        // Mongoose validation errors or general database errors
        return NextResponse.json({ 
            message: 'Failed to create diet entry.', 
            error: error.message 
        }, { status: 400 });
    }
}
