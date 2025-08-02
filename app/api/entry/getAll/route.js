import { NextResponse } from 'next/server';
import { connectSimpleDB, getAllEntries } from '../../../../lib/simpleDB';

export async function GET() {
  try {
    await connectSimpleDB();
    
    const entries = getAllEntries()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 50);

    return NextResponse.json({
      entries
    });

  } catch (error) {
    console.error('Get entries error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}