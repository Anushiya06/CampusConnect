import { NextResponse } from 'next/server';
import { connectSimpleDB, deleteEntry } from '../../../../../lib/simpleDB';

export async function DELETE(request, { params }) {
  try {
    await connectSimpleDB();
    
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    const deleted = deleteEntry(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Entry deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Delete entry error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 