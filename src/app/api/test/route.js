import dbConnect from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    // If dbConnect succeeds, return a success message
    return NextResponse.json({ 
      message: 'Database connection successful!', 
      status: 'connected' 
    });

  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      message: 'Database connection failed', 
      error: error.message 
    }, { status: 500 });
  }
}
