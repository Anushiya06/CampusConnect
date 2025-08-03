import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const entriesPath = path.join(process.cwd(), 'data', 'entries.json');

export async function POST(request) {
  try {
    const { name, email, message, purpose, category } = await request.json();

    if (!name || !email || !message || !purpose) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validPurposes = ['Student Visit', 'Alumni Visit', 'Faculty Meeting', 'Campus Tour', 'Seminar/Workshop', 'Event Attendance', 'Job Interview', 'Research', 'Administrative', 'Other'];
    if (!validPurposes.includes(purpose)) {
      return NextResponse.json({ error: 'Invalid purpose' }, { status: 400 });
    }

    const validCategories = ['Academic', 'Social', 'Professional', 'Cultural', 'Sports', 'Technology', 'Arts', 'Community Service', 'Other'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const fileData = fs.readFileSync(entriesPath, 'utf-8');
    const entries = JSON.parse(fileData);

    const newEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      purpose,
      category: category || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    entries.push(newEntry);
    fs.writeFileSync(entriesPath, JSON.stringify(entries, null, 2));

    return NextResponse.json({ message: 'Entry created', entry: newEntry }, { status: 201 });
  } catch (error) {
    console.error('Create entry error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
