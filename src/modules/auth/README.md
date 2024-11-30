# Talkiee

*A simple real-time chat application for text and media sharing.*

## Table of Contents
- [How It Works](#how-it-works)
- [Main Features](#main-features)
- [Main Packages](#main-packages)
- [Challenges](#challenges)

---

## How It Works

This project consists of the following key components:

### **1. Landing Page**
- A simple and minimal landing page that introduces the app’s purpose and features.
- **Key Features:**
  - Two dedicated call-to-action buttons:
    1. **Send New Message**: Start a new conversation.
    2. **Continue Messaging**: Resume messaging with an existing contact.
  - Clicking either button redirects the user to the main chat layout screen.

---

### **2. Chat Layout**
The core interface where all features come together. The design adapts slightly based on mobile or desktop views, but the core structure remains the same.

- **Layout Overview:**
  - **Sidebar:**
    - Manages user contacts (if any).
    - Provides options to start a new message or log out.
  - **Chat Content Area:**
    - **Navbar:**
      - Displays the recipient's name, image, and online/offline status.
      - Includes an icon to open the conversation info panel (e.g., details, shared media).
    - **Chat Body:**
      - Displays all chat messages.
      - Clickable images open in a modal for better viewing.
    - **Chat Controller:**
      - Allows the user to type or upload messages (text or media) and send them.

---

### **3. Installation**
This project is built with **Vite** and leverages several third-party services like Firebase.

**Steps to Install and Run:**
1. Clone the repository:
   ```bash
   git clone https://github.com/Ahmed-dev-98/Chat-app.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables to configure Firebase:

   **Firebase Configuration:**
   ```env
   VITE_API_KEY=AIzaSyAA3OeYa0YDdNYdnSabs7BUQdEPpIc45IA
   VITE_AUTH_DOMAIN=task-management-7913d.firebaseapp.com
   VITE_PROJECT_ID=task-management-7913d
   VITE_STORAGE_BUCKET=task-management-7913d.appspot.com
   VITE_MESSAGING_SENDER_ID=945678658013
   VITE_APP_ID=1:945678658013:web:a51b24b002f802b68fee34
   VITE_MEASUREMENT_ID=G-JBZM1Z0W3K
   ```

4. Run the app (default port: 5173):
   ```bash
   npm run dev
   ```

---

## Main Features

- **Landing Page:** Explains the app's purpose and features.
- **Real-Time Updates:** All user interactions are synced in real-time using Firebase.
- **Firebase Integration:**
  - Firestore database to store user and message data.
  - Firebase Authentication for secure login with OAuth and credentials.
  - Firebase Storage for media uploads.
- **Local State Management:** Redux ensures the app remains up-to-date.
- **Protected Routes:** Prevents unauthorized access to certain pages.
- **Image Uploads:** Images are stored in Firebase and displayed in the chat.
  - Images are clickable and open in a modal for a better view.
- **Responsive Design:** Adapts seamlessly across devices (mobile, tablet, desktop).

---

## Main Packages

- **ShadCN:** A UI library for building clean, reusable components.
- **Firebase:** Provides database, authentication, and media storage.
- **React Router:** Handles app routing in a single-page application (SPA).

---

## Challenges

### **1. Limited Time**
- **Challenge:** I had only 2-3 hours a day to work on this project due to my full-time 9-5 job and personal commitments.
- **Solution:** Focused on optimizing the time available by planning tasks and working in focused sprints.

### **2. Lack of Design Resources**
- **Challenge:** There was no provided design or reference URL. I had to design the interface from scratch, inspired by WhatsApp Web.
- **Solution:** Leveraged Firebase services for the backend and created a user-friendly UI with ShadCN and Tailwind CSS.

### **3. Chat Room Management**
- **Challenge:** Generating unique chatroom IDs for each conversation to store messages correctly.
- **Solution:** Created a custom function that generates a consistent string based on members' IDs to identify a chatroom.

### **4. Managing Media in Conversations**
- **Challenge:** Organizing and retrieving media files shared in each chat.
- **Solution:** Used subcollections in Firebase Firestore for each chatroom to store and fetch images efficiently.

### **5. Firebase Pricing Changes**
- **Challenge:** Firebase's Spark Plan (free tier) no longer supports all the required services (e.g., storage and Firestore).
- **Solution:** Reused credentials from an older Firebase project, which is reflected in the `task-management` configuration credentials.

---
