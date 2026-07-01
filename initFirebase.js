/**
 * Firebase Initialization Script
 * 
 * Run this once after setting up Firebase to populate your database
 * with default data from your utils files.
 * 
 * HOW TO USE:
 * 1. Make sure your .env file is configured with Firebase credentials
 * 2. Start your dev server: npm run dev
 * 3. Either:
 *    a) Click "SYNC_TO_FIREBASE" in the admin dashboard, OR
 *    b) Open browser console and paste this file's content
 */

import { syncDefaultDataToFirebase } from './src/utils/dataManager.js';

console.log('🔥 Starting Firebase initialization...');
console.log('📦 This will sync all default data to your Firebase database');

syncDefaultDataToFirebase()
  .then(result => {
    if (result.success) {
      console.log('✅ SUCCESS! All data synced to Firebase');
      console.log('🎉 Your portfolio is now connected to Firebase');
      console.log('');
      console.log('Next steps:');
      console.log('1. Visit your website to see live data');
      console.log('2. Go to /admin/login to manage content');
      console.log('3. Edit data through the admin panel');
    } else {
      console.error('❌ Sync failed:', result.message);
      console.log('');
      console.log('Troubleshooting:');
      console.log('1. Check your .env file for correct Firebase credentials');
      console.log('2. Verify Firebase project is active');
      console.log('3. Ensure Firestore is enabled in Firebase console');
    }
  })
  .catch(error => {
    console.error('❌ Error during sync:', error);
    console.log('');
    console.log('Common issues:');
    console.log('- Missing .env file (copy from .env.example)');
    console.log('- Incorrect Firebase credentials');
    console.log('- Firebase not initialized');
    console.log('- Network connection issues');
  });
