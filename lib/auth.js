import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
console.log('JWT_SECRET is defined:', !!process.env.JWT_SECRET);

export function signToken(payload) {
  console.log('Signing token with payload:', payload);
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  console.log('Token signed successfully');
  return token;
}

export function verifyToken(token) {
  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully');
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

export async function hashPassword(password) {
  console.log('Hashing password...');
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw error;
  }
}

export async function comparePassword(password, hashedPassword) {
  console.log('Comparing password...');
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Password comparison result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Password comparison failed:', error);
    throw error;
  }
}
