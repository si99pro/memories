import { signUp, signIn, signOutUser, onAuthStateChangedWrapper, getUserDocument } from './auth.js';  // Adjust the path as necessary

// Get references to HTML elements
const messageDiv = document.getElementById("message");
const signupUsernameInput = document.getElementById("signup-username");
const signupEmailInput = document.getElementById("signup-email");
const signupPasswordInput = document.getElementById("signup-password");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");

// Helper function to display messages
function displayMessage(message, type = "info") {
  messageDiv.textContent = message;
  messageDiv.className = type; // Use classes 'success' or 'error' for styling
}

// Function to handle Sign Up
window.handleSignUp = async () => {  // Make it a global function
  const username = signupUsernameInput.value;
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;

  try {
    const user = await signUp(email, password, username);
    displayMessage("Sign-up successful!", "success");
    console.log("Signed up user:", user);
  } catch (error) {
    displayMessage(`Sign-up failed: ${error.message}`, "error");
    console.error("Sign-up error:", error);
  }
};

// Function to handle Sign In
window.handleSignIn = async () => {
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  try {
    const user = await signIn(email, password);
    displayMessage("Login successful!", "success");
    console.log("Logged in user:", user);
  } catch (error) {
    displayMessage(`Login failed: ${error.message}`, "error");
    console.error("Login error:", error);
  }
};

// Function to handle Sign Out
window.handleSignOut = async () => {
  try {
    await signOutUser();
    displayMessage("Signed out.", "info");
  } catch (error) {
    displayMessage(`Sign-out failed: ${error.message}`, "error");
    console.error("Sign-out error:", error);
  }
};

// Function to check Authentication State
onAuthStateChangedWrapper(async (user) => {
  if (user) {
    console.log("User is signed in:", user);
    displayMessage(`Welcome, ${user.email}!`, "success"); // Or fetch the username from Firestore

    // Example: Fetch user document from Firestore
    const userDoc = await getUserDocument(user.uid);
    if (userDoc) {
        console.log("User document:", userDoc);
        // You can now access userDoc.username, userDoc.profilePicture, etc.
        displayMessage(`Welcome, ${userDoc.username}!`, "success");
    } else {
        console.log("User document not found.");
    }

  } else {
    console.log("User is signed out");
    displayMessage("You are signed out.", "info");
  }
});
