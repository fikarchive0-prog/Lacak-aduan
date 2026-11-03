const { applicationDefault, getApps, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');

let firebaseApp;

function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  if (!databaseURL) {
    const error = new Error('FIREBASE_DATABASE_URL is required.');
    error.code = 'FIREBASE_CONFIG_MISSING';
    throw error;
  }

  firebaseApp = getApps()[0] || initializeApp({
    credential: applicationDefault(),
    databaseURL,
  });
  return firebaseApp;
}

function firebaseAuth() {
  return getAuth(getFirebaseApp());
}

function realtimeDatabase() {
  return getDatabase(getFirebaseApp());
}

module.exports = { firebaseAuth, realtimeDatabase };