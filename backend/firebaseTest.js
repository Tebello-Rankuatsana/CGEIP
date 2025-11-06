// testing firebase connection

import { db } from './config/firebase.js';

async function test() {
  try {
    const testRef = db.collection('test').doc('hello');
    await testRef.set({ msg: 'Firebase connected!' });
    console.log('Test document added successfully');
  } catch (error) {
    console.error('Error connecting to Firestore:', error.message);
  }
}

test();
