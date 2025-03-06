// Import necessary Firebase modules and initialize Firebase (from firebaseConfig.js)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics-compat.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZhVSVnTX5yzQOqqfp14ww8PoXtiCUAms",  // ***REPLACE WITH YOUR ACTUAL API KEY***
  authDomain: "memories-wa.firebaseapp.com",
  projectId: "memories-wa",
  storageBucket: "memories-wa.firebasestorage.app",
  messagingSenderId: "1046131095621",
  appId: "1:1046131095621:web:fc05ba921d97b321fecb2c",
  measurementId: "G-SZG552QW0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Helper function to display messages
function displayMessage(message, type = "info") {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = type; // Use classes 'success' or 'error' for styling
}

// Function to create a new user (Sign-up)
window.handleSignUp = async function() {
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user data in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            email: user.email,
            username: username,
            createdAt: new Date(),
            profilePicture: "" // can be an empty string or a default URL
            // Add other relevant user data here
        });

        displayMessage("Sign-up successful!", "success");
        console.log("User signed up:", user);
        return user;  // Return the user object for handling
    } catch (error) {
        displayMessage(`Sign-up failed: ${error.message}`, "error");
        console.error("Sign-up error:", error.message);
        throw error;  // Re-throw the error to be handled by the caller
    }
};

// Function to sign in an existing user (Login)
window.handleSignIn = async function() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        displayMessage("Login successful!", "success");
        console.log("User signed in:", user);
        return user;
    } catch (error) {
        displayMessage(`Login failed: ${error.message}`, "error");
        console.error("Sign-in error:", error.message);
        throw error; // Re-throw the error
    }
};

// Function to sign out the current user
window.handleSignOut = async function() {
    try {
        await signOut(auth);
        displayMessage("Signed out.", "info");
        console.log("User signed out");
    } catch (error) {
        displayMessage(`Sign-out failed: ${error.message}`, "error");
        console.error("Sign-out error:", error.message);
    }
};

// Function to check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is signed in:", user);
        displayMessage(`Welcome, ${user.email}!`, "success"); // Or fetch the username from Firestore

        // Example: Fetch user document from Firestore
        try {
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log("User document:", userData);
                // You can now access userData.username, userData.profilePicture, etc.
                displayMessage(`Welcome, ${userData.username}!`, "success");
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting user document:", error);
        }
    } else {
        console.log("User is signed out");
        displayMessage("You are signed out.", "info");
    }
});
