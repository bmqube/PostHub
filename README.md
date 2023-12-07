# PostHub

Welcome to PostHub, a social networking platform that enables users to engage in secure communication with one another through end-to-end encryption.

<br>

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)


<br>

## Introduction
PostHub is an open-source social media platform that aims to provide users with a seamless and engaging online space for connecting, sharing ideas, and fostering meaningful conversations in a user-friendly environment. This project is divided into two main parts: the frontend (client) and the backend (server). The frontend is built using React, while the backend utilizes Express.js. The chatting system is developed with the help of Socket.Io library. For the Database management system, we used MongoDB

<br>

## Features
- **User Profiles:** Create and customize personal profiles with details such as profile pictures, cover photos, and personal information.
- **News Feed:** Stay updated with a dynamic news feed displaying posts, photos, and updates from friends and pages you follow.
- **Friend Requests:** Connect with others by sending and receiving friend requests, expanding your network of contacts.
- **Status Updates:** Share your thoughts, activities, and multimedia content through text-based status updates.
- **Photos and Albums:** Upload and organize photos into albums, providing a visually appealing way to share memories.
- **Like and Comment:** Interact with posts by expressing appreciation through "likes" and engaging in discussions through comments.
- **Privacy Settings:** Control the visibility of your content and manage who can see your posts, ensuring a personalized and secure experience.
- **Notifications:** Receive real-time notifications for friend requests, messages, and interactions to stay informed and engaged.
- **Messaging:** Communicate with friends through private messages, fostering one-on-one conversations.

<br>

## Installation
To get started with PostHub, follow these steps:

1. **Clone the repository:**
   
   ```bash
   git clone https://github.com/bmqube/posthub.git
   
2. **Navigate to the client folder (frontend):**
    ```bash
    cd posthub/client

3. **Install dependencies:**
     ```bash
    npm install

4. **Navigate to the server folder (backend):**
    ```bash
    cd ../server

5. **Install server dependencies:**
    ```bash
    npm install

<br>

## Usage

1. **Run the frontend:**
   
    ```bash
    cd ../client
    npm start
    
Open your browser and visit http://localhost:3000 to see the frontend in action.

2. **Run the backend:**

    ```bash
    cd ../server
    npm start
    
Your backend server should be running on http://localhost:8000.

<br>

## Tech Stack
- Frontend: React
- Backend: Express.js
- DBMS: MongoDB
- Others: Socket.Io

<br>

## Contributing
We welcome contributions from the community. If you find a bug or have an idea for an enhancement, please open an issue or submit a pull request.
