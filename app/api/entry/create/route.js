import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb'; // assumes you have this setup

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const entriesCollection = db.collection('entries');

    const { name, email, message, purpose, category } = await request.json();

    if (!name || !email || !message || !purpose) {
      return NextResponse.json(
        { error: 'Name, email, message, and purpose are required' },
        { status: 400 }
      );
    }

    const validPurposes = [
      'Student Visit', 'Alumni Visit', 'Faculty Meeting', 'Campus Tour',
      'Seminar/Workshop', 'Event Attendance', 'Job Interview', 'Research',
      'Administrative', 'Other'
    ];

    if (!validPurposes.includes(purpose)) {
      return NextResponse.json(
        { error: 'Invalid purpose selected' },
        { status: 400 }
      );
    }

    if (category) {
      const validCategories = [
        'Academic', 'Social', 'Professional', 'Cultural', 'Sports',
        'Technology', 'Arts', 'Community Service', 'Other'
      ];

      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Invalid category selected' },
          { status: 400 }
        );
      }
    }

    const newEntry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      purpose,
      category: category || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await entriesCollection.insertOne(newEntry);

    return NextResponse.json({
      message: 'Entry created successfully',
      entry: {
        _id: result.insertedId,
        ...newEntry
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Entry creation error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'An entry with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
