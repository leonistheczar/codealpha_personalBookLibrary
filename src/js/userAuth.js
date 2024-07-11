// Parsing variables for Registration
  const firstNameInput = document.querySelector('#firstNameInput');
  const lastNameInput = document.querySelector('#lastNameInput');
  const contactInput = document.querySelector('#contactInput');
  const emailInput = document.querySelector('#emailInput');
  const passwordInput = document.querySelector('#passwordInput');
  const cfPasswordInput = document.querySelector('#confirmPasswordInput');
  const submitForm = document.querySelector('#register');

// Event Listeners
  submitForm.addEventListener('submit', userSignup);

// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
  import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
  import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// Your web app's Firebase configuration
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

// Initialize Firestore
  const db = getFirestore(app);

// Sign Up
  async function userSignup(e) {
      e.preventDefault();

      // Input elements parsing for signup
      const firstName = firstNameInput.value;
      const lastName = lastNameInput.value;
      const contact = contactInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const cfPassword = cfPasswordInput.value;

      // Sign Up conditions
      if (password !== cfPassword) {
          alert('Passwords do not match!');
          return;
      }
      if (password.length < 6) {
          alert('Password should be greater than 6 characters!');
          return;
      }

      try {
          const auth = getAuth();
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Add user data to Firestore
          await setDoc(doc(db, "userIDs", user.uid), {
              FirstName: firstName,
              LastName: lastName,
              Contact: contact,
              CreatedAt: new Date()
          });
          await updateProfile(auth.currentUser, {
            displayName: `${firstName} ${lastName}`
          });

          window.location.href = "./dashboard.html";   
      } 
      catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert('Error during sign up:', errorCode, errorMessage);
      }
  }


