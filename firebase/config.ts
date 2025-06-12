import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration - using placeholder values
// In a real app, you would use environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForDevelopmentPurposesOnly",
  authDomain: "example-app-demo.firebaseapp.com",
  projectId: "example-app-demo",
  storageBucket: "example-app-demo.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};

// Initialize Firebase - ensure we only initialize once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the existing app
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;