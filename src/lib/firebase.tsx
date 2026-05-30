import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCz-hNLwDI5-v1UJldxtjoiA-QlP-EJ6aw",
  authDomain: "aarya-spicy-food-babe2.firebaseapp.com",
  projectId: "aarya-spicy-food-babe2",
  storageBucket: "aarya-spicy-food-babe2.firebasestorage.app",
  messagingSenderId: "144482465871",
  appId: "1:144482465871:web:6aa807e09bd07e5650923a",
  measurementId: "G-4ZQV26KMGE"
};

// Initialize Firebase only if it hasn't been initialized yet (prevents Next.js SSR crashes)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics safely (only on the client side)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };