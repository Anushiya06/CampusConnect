import { NextResponse } from 'next/server';
import { connectSimpleDB, createEntry } from '../../../../lib/simpleDB';

export async function POST(request) {
  try {
    await connectSimpleDB();
    
    const { name, email, message, purpose, category } = await request.json();

    if (!name || !email || !message || !purpose || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const entry = createEntry({
      name,
      email,
      message,
      purpose,
      category
    });

    return NextResponse.json({
      message: 'Entry created successfully',
      entry
    }, { status: 201 });

  } catch (error) {
    console.error('Entry creation error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}