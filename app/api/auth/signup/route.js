// app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectSimpleDB, findUserByEmail, createUser } from '../../../../lib/simpleDB';

// POST handler
export async function POST(req) {
  try {
    await connectSimpleDB();
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createUser({ name, email, password: hashedPassword, role });

    return NextResponse.json({ 
      message: 'User created', 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
