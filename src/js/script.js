// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore,collection,addDoc,query,where,getDocs,deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIuvt9q-Jf_zeA7BZqZJ45qRDCPjEJ8cg",
  authDomain: "book-nest-5d7ad.firebaseapp.com",
  databaseURL: "https://book-nest-5d7ad-default-rtdb.firebaseio.com",
  projectId: "book-nest-5d7ad",
  storageBucket: "book-nest-5d7ad.appspot.com",
  messagingSenderId: "579249804925",
  appId: "1:579249804925:web:339161c35a89a49da8c314",
  measurementId: "G-7H7MW7KJ0R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);
// Initialize Firebase Auth
const auth = getAuth();

// Parsing variables
const passwordIcon = document.querySelector("#eyeIcon");
const CFpasswordIcon = document.querySelector("#cfEye");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const emailInput = document.querySelector("#emailInput");
const btnLogOut = document.querySelector(".logOut");
const currentUser = document.querySelector("#dashboard-user");


// Dashboard
const bookNameInput = document.querySelector("#bookName");
const bookAuthorInput = document.querySelector("#bookAuthor");
const bookCategoryInput = document.querySelector("#bookCategory");
const bookTypeInput = document.querySelector("#bookType");
const dashForm = document.querySelector("#dashboard-form");
const submitBtn = document.querySelector("#submitBook");
const delBtn = document.querySelector(".btnDelete");

// Event Listeners
document.addEventListener("DOMContentLoaded", function loadEventListeners() {
  if (window.location.href.includes("userAuth.html")) {
    passwordIcon.addEventListener("click", changePasswordInputType);
    CFpasswordIcon.addEventListener("click", changeConfirmPasswordInputType);
  }
  if (window.location.href.includes("userLogin.html")) {
    passwordIcon.addEventListener("click", changePasswordInputType);
  }
  if (window.location.href.includes("dashboard.html")) {
    dashForm.addEventListener("submit", addBooksToTable);
    btnLogOut.addEventListener("click", userSignOut);
    delBtn.addEventListener("click", async () => {
      const user = auth.currentUser;
      if (user) {
        await deleteAllBooksForUser(user.uid);
        alert("All books have been deleted!");
      } else {
        alert("No user is signed in!");
      }
    });
  }
});

// Functions
function changePasswordInputType() {
  const type = passwordInput.getAttribute("type");
  if (type === "password") {
    passwordInput.setAttribute("type", "text");
    passwordIcon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordInput.setAttribute("type", "password");
    passwordIcon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

function changeConfirmPasswordInputType() {
  const typeCP = confirmPasswordInput.getAttribute("type");
  if (typeCP === "password") {
    confirmPasswordInput.setAttribute("type", "text");
    CFpasswordIcon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    confirmPasswordInput.setAttribute("type", "password");
    CFpasswordIcon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// Add books
let bookId = 1; // Initialize book ID counter
async function addBooksToTable(e) {
  if (window.location.href.includes('dashboard.html')) {
  e.preventDefault();
  const user = auth.currentUser;
  const email = user.email;
  if (!user) {
    alert("No user is signed in.");
    return;
  }

  if (
    bookNameInput.value !== "" &&
    bookAuthorInput.value !== "" &&
    bookCategoryInput.value !== "" &&
    bookTypeInput.value !== ""
  ) {
    // Get table body element
    const tableBody = document.querySelector(".tableBody");

    // Get input values
    const bookName = bookNameInput.value;
    const bookAuthor = bookAuthorInput.value;
    const bookCategory = bookCategoryInput.value;
    const bookType = bookTypeInput.value;
    const bookCover = document.querySelector("#bookImage");

    // Create new row and cells
    const newRow = document.createElement("tr");
    const newBookId = document.createElement("td");
    const newBookName = document.createElement("td");
    const newBookAuthor = document.createElement("td");
    const newBookCategory = document.createElement("td");
    const newBookType = document.createElement("td");
    const newBookCover = document.createElement("td");
    const newBookImg = document.createElement("img");
    const deleteBook = document.createElement("td");

    // Set text content for each cell
    newBookId.textContent = bookId++;
    newBookName.textContent = bookName;
    newBookAuthor.textContent = bookAuthor;
    newBookCategory.textContent = bookCategory;
    newBookType.textContent = bookType;
    deleteBook.innerHTML = `<a href='#' class='delete-book'><i class="fa-solid fa-xmark fa-lg" style="color: #850000; margin-left: 1.2rem;"></i></a>`;

    // Image Cover display
    const file = bookCover.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageData = e.target.result;

        newBookImg.src = imageData;
        newBookImg.alt = "Book Cover";
        newBookImg.style.maxWidth = "100px";

        newBookCover.appendChild(newBookImg);

        // Save book details to Firestore
        saveBookToFirestore(
          user.uid,
          bookId,
          bookName,
          bookAuthor,
          bookCategory,
          bookType,
          imageData,
          email
        );
      };
      reader.readAsDataURL(file);
    }

    // Append cells to the new row
    newRow.appendChild(newBookId);
    newRow.appendChild(newBookName);
    newRow.appendChild(newBookAuthor);
    newRow.appendChild(newBookCategory);
    newRow.appendChild(newBookType);
    newRow.appendChild(newBookCover);
    newRow.appendChild(deleteBook);

    // Set row ID to document ID for easy deletion
    newRow.id = `book-${bookId}`;

    // Append new row to the table body
    tableBody.appendChild(newRow);

    // Add event listener to delete icon
    deleteBook
      .querySelector(".delete-book")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        const bookIdToDelete = newRow.id.split("-")[1];
        await removeBookFromFirestore(user.uid, bookIdToDelete);
        newRow.remove();
      });

    // Clear input fields after adding the book to the table
    dashForm.reset();
  } else {
    alert("Please fill out all the fields before submission!");
    }
  }
}

async function saveBookToFirestore(
  uid,
  bookId,
  bookName,
  bookAuthor,
  bookCategory,
  bookType,
  coverImage,
  email
) {
  try {
    const docRef = await addDoc(collection(db, "bookDetails"), {
      uid: uid,
      bookId: bookId,
      bookName: bookName,
      bookAuthor: bookAuthor,
      bookCategory: bookCategory,
      bookType: bookType,
      coverImage: coverImage,
      email: email,
    });
  } catch (e) {
    alert("Error adding document: ",e);
  }
}

// Current User
if (window.location.href.includes('dashboard.html')) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      currentUser.textContent = `Hi, ${user.displayName}`;
      loadBooksForUser(uid);
    } else {
      alert("No user is signed in");
    }
  });
}

async function loadBooksForUser(uid) {
  const q = query(collection(db, "bookDetails"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let bookId = 1; // Reset the book ID counter

  querySnapshot.forEach((doc) => {
    const book = doc.data();
    book.bookId = bookId++; // Assign a sequential ID
    addBookToTable(book);
  });
}

function addBookToTable(book) {
  const tableBody = document.querySelector(".tableBody");
  const newRow = document.createElement("tr");
  const newBookId = document.createElement("td");
  const newBookName = document.createElement("td");
  const newBookAuthor = document.createElement("td");
  const newBookCategory = document.createElement("td");
  const newBookType = document.createElement("td");
  const newBookCover = document.createElement("td");
  const newBookImg = document.createElement("img");
  const deleteBook = document.createElement("td");

  newBookImg.src = book.coverImage;
  newBookImg.alt = "Book Cover";
  newBookImg.style.maxWidth = "100px";
  newBookCover.appendChild(newBookImg);

  newBookId.textContent = book.bookId;
  newBookName.textContent = book.bookName;
  newBookAuthor.textContent = book.bookAuthor;
  newBookCategory.textContent = book.bookCategory;
  newBookType.textContent = book.bookType;
  deleteBook.innerHTML = `<a href='#' class='delete-book'><i class="fa-solid fa-xmark fa-lg" style="color: #850000; margin-left: 1.2rem;"></i></a>`;

  newRow.appendChild(newBookId);
  newRow.appendChild(newBookName);
  newRow.appendChild(newBookAuthor);
  newRow.appendChild(newBookCategory);
  newRow.appendChild(newBookType);
  newRow.appendChild(newBookCover);
  newRow.appendChild(deleteBook);

  // Set row ID to document ID for easy deletion
  newRow.id = `book-${book.bookId}`;

  tableBody.appendChild(newRow);

  // Add event listener to delete icon
  deleteBook
    .querySelector(".delete-book")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      const bookIdToDelete = newRow.id.split("-")[1];
      await removeBookFromFirestore(book.uid, bookIdToDelete);
      newRow.remove();
    });
}

async function removeBookFromFirestore(uid, bookId) {
  const q = query(
    collection(db, "bookDetails"),
    where("uid", "==", uid),
    where("bookId", "==", parseInt(bookId))
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
    document.getElementById(`book-${bookId}`).remove();
  });
}
// Delete all books
async function deleteAllBooksForUser(uid) {
  const q = query(collection(db, "bookDetails"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  const tableBody = document.querySelector(".tableBody");

  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  // Clear all rows from the table
  tableBody.innerHTML = "";
}

// Sign Out
function userSignOut() {
  signOut(auth)
    .then(() => {
      window.location.href = "userLogin.html";
      alert("Signed Out");
    })
    .catch((error) => {
      alert("Sign Out Unsuccessful: ", error);
    });
}
