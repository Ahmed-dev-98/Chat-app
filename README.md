# Talkiee

[A simple real-time chat application for text and media sharing.]

## Table of Contents

- [How It Works](#how-it-works)
- [Main Features](#main-features)
- [Main Packages](#main-packages)
- [Challanges](#challanges)

## How It Works

This project consists of:

1. **Landing Page**: Describes the need we fulfill and our features.
   - The landing page is simple, with the main part being the call to action for login and registration.
   - After clicking on it, the user will be redirected chat layout screen which where will find the landing page.
   - a 2 dedicated call to actoin buttons which user can deside eather send new message or continue messaging a current member.

2. **chat layout**: The core of the app where all work is put together.

- the chat layout a little bit diffrent from mobile or laptop but in core there is 2 main parts
- sidebar where user can manage his contacts (if there is) and also can start a new message or logout from it
- chat content screen where user can see and visualize the chat messages , it contains the follow
  -navbar where the receptions image and name and its status apears also there is an icon on the right to open the conversation info to the more details and the media sent
- chat body whcih display yhe ui of chatting and the images within are also clickable
- chat controller which user can type or upload messages and send it

3. **Installation**: this project depending on vite combined with 2 main Third-party

   - Clone the repository: git clone https://github.com/Ahmed-dev-98/Chat-app.git
   - run npm istall
   - Create a .env file in the root directory.
   - Add the following variables to configure the integration with Firebase services:

   **Firebase Configuration**

   - VITE_API_KEY=AIzaSyAA3OeYa0YDdNYdnSabs7BUQdEPpIc45IA
   - VITE_AUTH_DOMAIN=task-management-7913d.firebaseapp.com
   - VITE_PROJECT_ID=task-management-7913d
   - VITE_STORAGE_BUCKET=task-management-7913d.appspot.com
   - VITE_MESSAGING_SENDER_ID=945678658013
   - VITE_APP_ID=1:945678658013:web:a51b24b002f802b68fee34
   - VITE_MEASUREMENT_ID=G-JBZM1Z0W3K

- This app is configured to run on port 5173 as vite default recomendation.
- finally run npm run dev

## Main Features

- landing page describe our app
- Firebase storage integration to store images
- Firebase firestore database integration to store users and message and do the querrise
- Firebase authentication using ooath or credientails methods integration to store users
- real-time updates throgh all firebase actions
- local state managmet using redux to keep our app idealy up to date
- image upload and every image is clicable to diplay ir through model
- protected route to safely route pupic pages and block the authenticated once

## Main Packages
- **Shadcn**: UI library
- **Firebase**: Image storage - firestore database - authenticaion
- **React Router**: App routing for SPA

## Challanges
  - first of all the time was so tight cause i have only 2-3 hours a day becouse of my 9-5 work and my day routine
  - the lack of resourse that i didnt get visualized resource like design or even a url refrence (maybe its a part of the task to test this skills) , so i had to clone whatsapp to ui and used firebase services for back-end
  - create a chatroom id for each conversation , i had to make a custom function that takes the members ids and return a string in consistence order so i can save the messages in this chat to this specific room
  - i needed to save each chat room its images in a sub collection in the chatroom collection to easly lookup and bring back this images only
  - after i stablished my new firebase project i relaized that the spark plan is no longer avalianle and some services like storage and firestore are now paid , so i had to pick an old firebase storage and use it in this app so u might see task-managemnt in the config creds