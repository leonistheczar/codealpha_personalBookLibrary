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

  const firebaseConfig = {
    apiKey: "AIzaSyBIuvt9q-Jf_zeA7BZqZJ45qRDCPjEJ8cg",
    authDomain: "book-nest-5d7ad.firebaseapp.com",
    databaseURL: "https://book-nest-5d7ad-default-rtdb.firebaseio.com",
    projectId: "book-nest-5d7ad",
    storageBucket: "book-nest-5d7ad.appspot.com",
    messagingSenderId: "579249804925",
    appId: "1:579249804925:web:339161c35a89a49da8c314",
    measurementId: "G-7H7MW7KJ0R"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


  function userSignIn(e) {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        window.location.href = './dashboard.html';
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
