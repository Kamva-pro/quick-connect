// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAQ_qcJSDXbB0hi1EchDAj2upZruaSutOo",
  authDomain: "quick-connect-7c017.firebaseapp.com",
  projectId: "quick-connect-7c017",
  storageBucket: "quick-connect-7c017.appspot.com",
  messagingSenderId: "931419911697",
  appId: "1:931419911697:web:a67a65d6148267837f63b0",
  measurementId: "G-C781R8KJ33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase auth instance
export const auth = getAuth(app);
