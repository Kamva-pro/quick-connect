// TODO: Add SDKs for Firebase products that you want to use
import { firebase } from '@react-native-firebase/auth';
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const firebase = initializeApp(firebaseConfig);

  export default firebase;