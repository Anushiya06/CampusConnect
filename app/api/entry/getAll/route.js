import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const entriesPath = path.join(process.cwd(), 'data', 'entries.json');

export async function GET() {
  try {
    const fileData = fs.readFileSync(entriesPath, 'utf-8');
    const entries = JSON.parse(fileData);

    const sortedEntries = entries
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 100);

    return NextResponse.json({ entries: sortedEntries });
  } catch (error) {
    console.error('Get entries error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
