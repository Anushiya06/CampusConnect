import fs from 'fs';
import path from 'path';

const USERS_DB_FILE = path.join(process.cwd(), 'data', 'users.json');
const ENTRIES_DB_FILE = path.join(process.cwd(), 'data', 'entries.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(USERS_DB_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(USERS_DB_FILE)) {
    fs.writeFileSync(USERS_DB_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(ENTRIES_DB_FILE)) {
    fs.writeFileSync(ENTRIES_DB_FILE, JSON.stringify([]));
  }
};

// User functions
const readUsers = () => {
  ensureDataDir();
  const data = fs.readFileSync(USERS_DB_FILE, 'utf8');
  return JSON.parse(data);
};

const writeUsers = (users) => {
  ensureDataDir();
  fs.writeFileSync(USERS_DB_FILE, JSON.stringify(users, null, 2));
};

export const findUserByEmail = (email) => {
  const users = readUsers();
  return users.find(user => user.email === email);
};

export const createUser = (userData) => {
  const users = readUsers();
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  writeUsers(users);
  return newUser;
};

// Entry functions
const readEntries = () => {
  ensureDataDir();
  const data = fs.readFileSync(ENTRIES_DB_FILE, 'utf8');
  return JSON.parse(data);
};

const writeEntries = (entries) => {
  ensureDataDir();
  fs.writeFileSync(ENTRIES_DB_FILE, JSON.stringify(entries, null, 2));
};

export const createEntry = (entryData) => {
  const entries = readEntries();
  const newEntry = {
    _id: Date.now().toString(),
    ...entryData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  entries.push(newEntry);
  writeEntries(entries);
  return newEntry;
};

export const getAllEntries = () => {
  return readEntries();
};

export const deleteEntry = (entryId) => {
  const entries = readEntries();
  const initialLength = entries.length;
  const filteredEntries = entries.filter(entry => entry._id !== entryId);
  
  if (filteredEntries.length === initialLength) {
    return false; // Entry not found
  }
  
  writeEntries(filteredEntries);
  return true; // Entry deleted successfully
};

export const connectSimpleDB = async () => {
  ensureDataDir();
  console.log('Connected to Simple File Database');
}; 