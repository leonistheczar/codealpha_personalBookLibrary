# Book Nest Library

> Manage your personal book collection with ease using this web application.

---

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
---

## Description

The Personal Book Library is a web application built to help users organize and manage their books. 
It provides a user-friendly interface for adding, updating, and deleting book entries, all stored securely in Firebase Firestore. 
Users can authenticate via Firebase Authentication to access their personal dashboard and maintain their book collection effortlessly.
---

## Features

- **User Authentication**: Secure sign-up and sign-in functionality using Firebase Authentication.
- **Dashboard**: Personalized dashboard for adding and managing book details.
- **CRUD Operations**: Easily add, update, delete books with real-time updates using Firestore.
- **Responsive Design**: Responsive layout to ensure usability across devices.

---
## Technologies

- **Frontend**: HTML, CSS (Sass), JavaScript
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: Netlify

---

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. Configure Firebase:
   - Create a Firebase project and enable Firebase Authentication and Firestore.
   - Replace Firebase configuration details in `firebaseConfig` variable in `index.js`.

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

---

## Usage

- **Sign Up/Sign In**: Register using your email and password. Already registered users can sign in.
- **Dashboard**: Add new books using the form provided. Book details will appear in the table below.
- **Delete All Books**: Use the "Delete All Books" button to remove all books from the table and Firestore database.

---

## Contributing

Contributions are welcome! If you have suggestions, improvements, or issues, feel free to open an issue or submit a pull request.

---
