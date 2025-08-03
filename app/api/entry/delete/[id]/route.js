import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const entriesPath = path.join(process.cwd(), 'data', 'entries.json');

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    const fileData = fs.readFileSync(entriesPath, 'utf-8');
    let entries = JSON.parse(fileData);

    const initialLength = entries.length;
    entries = entries.filter(entry => entry.id !== id);

    if (entries.length === initialLength) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    fs.writeFileSync(entriesPath, JSON.stringify(entries, null, 2));

    return NextResponse.json({ message: 'Entry deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete entry error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
