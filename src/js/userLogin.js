  // Parsing variables for Signing In
  const emailInput = document.querySelector('#emailInput');
  const passwordInput = document.querySelector('#passwordInput');
  const submitForm = document.querySelector('#register');

  //  Event Listeners
  submitForm.addEventListener('submit', userSignIn);
  document.addEventListener('DOMContentLoaded', chechAuth);

  // Firebase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
  import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// Import Firebase Configutaion
    import firebaseConfig from "../secure";
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

// Sign In
  function userSignIn(e) {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        window.location.href = './dashboard';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
  }
  function chechAuth() {
    const auth = getAuth();
    const user = auth.currentUser;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        alert("User Signed In");
      } else {
        alert("User Not Signed In / Signed Out");
      }
    });
  }
