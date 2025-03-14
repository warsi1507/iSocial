<div align="center">
  <img src="assets/images/iSocial-logo.png" alt="iSocial Logo" width="200"/>

  *Your next-generation social networking platform*
  </div>

  ## 🚀 Introduction

  iSocial is a cutting-edge social media web application built using the MEN stack with EJS templating. It enables users to connect, share, and interact with friends and communities in real-time. With a robust authentication system, real-time messaging capabilities, and efficient background processing, iSocial delivers a seamless social networking experience.

  ## ✨ Key Features

  - **🔐 Multi-Strategy Authentication**
    - Local authentication with username and password
    - JWT-based authentication for API access
    - Google OAuth2 integration for quick sign-ups
    - Secure session management

  - **💬 Real-time Messaging**
    - Instant messaging between users
    - Typing indicators
    - Support for rich text

  - **⚙️ Background Processing**
    - Efficient handling of resource-intensive tasks
    - Scheduled jobs for notifications and reminders
    - Email queue management
    - Data aggregation and analytics

  - **📧 Email Notifications**
    - Welcome emails for new users
    - Activity notifications
    - Custom email templates
    - Digest emails for platform updates

  ## 🛠️ Tech Stack

  ### Frontend
  - **EJS** - Templating engine
  - **HTML5/CSS3** - Structure and styling
  - **JavaScript** - Client-side scripting
  - **Tailwind CSS** - Utility-first CSS framework

  ### Backend
  - **Node.js** - JavaScript runtime
  - **Express.js** - Web application framework
  - **MongoDB** - NoSQL database
  - **Mongoose** - MongoDB object modeling

  ### Real-time Communication
  - **Socket.IO** - Enables real-time, bidirectional communication

  ### Authentication & Security
  - **Passport.js** - Authentication middleware
  - **JWT** - Secure token-based authentication
  - **Google OAuth2** - Third-party authentication

  ### Utilities & Tools
  - **Bull.js** - Queue management for background jobs
  - **Nodemailer** - Email sending capabilities
  - **Express-session** - Session management

  ## 📋 Installation Guide

  ### Prerequisites
  - Node.js (v14.x or higher)
  - MongoDB (v4.x or higher)
  - npm or yarn package manager
  - bcrypt
  - bull
  - connect-flash
  - connect-mongo
  - cookie-parser
  - dotenv
  - ejs
  - express
  - express-ejs-layouts
  - express-session
  - ioredis
  - jsonwebtoken
  - mongoose
  - multer
  - node-cron
  - nodemailer
  - passport
  - passport-google-oauth
  - passport-jwt
  - passport-local
  - sass
  - socket.io
  - toastr
  - validator
  - @tailwindcss/cli
  - nodemon
  - tailwindcss

  ### Setup Steps

  1. **Clone the repository**
     ```bash
     git clone https://github.com/warsi1507/iSocial.git
     cd isocial
     ```

  2. **Install dependencies**
     ```bash
     npm install
     ```

  3. **Environment configuration**
     - Create a `.env` file in the root directory
     - Add the following environment variables:
       ```
      PORT=8000
      BACKEND_URL='http://localhost:8000'

      BULL_PORT=6379
      BULL_HOST_URL='127.0.0.1'

      JWT_SEC_KEY='your_jwt_secret_key'
      SESSION_SECRET='your_session_secret'

      MONGOOSE_URL='mongodb://localhost/iSocial'

      GOOGLE_CLIENT_ID="your_google_client_id"
      GOOGLE_CLIENT_SECRET="your_google_client_secret"
      MAILER_EMAIL="your_email@example.com"
      MAILER_PASS="your_email_password"

      CORS_ORIGIN="*"
      BCRYPT_SALTS=10
       ```

  4. **Start the development server**
     ```bash
     npm run dev
     ```

  5. **Access the application**
     - Open your browser and navigate to `http://localhost:8000`

  ## 🔄 How It Works

  ### User Authentication
  Users can sign up and log in using their email and password or Google account. Upon successful authentication, a session is created and JWT tokens are used for API access.

  ### Social Networking
  - **User Profiles**: Users can create and customize their profiles
  - **Connections**: Users can follow/friend other users
  - **Posts**: Users can create, read, update, and delete posts
  - **Interactions**: Users can like, comment, and share posts

  ### Messaging System
  The real-time messaging system uses Socket.IO to provide instant communication. Messages are stored in the database and retrieved when users open conversations.

  ### Background Processing
  Bull.js handles resource-intensive tasks such as:
  - Email notifications
  - Feed generation
  - Analytics processing
  - Media processing

  ### Notifications
  The application sends notifications for various events:
  - New followers/friends
  - Post interactions (likes, comments)
  - Messages

  ## 📝 License

  This project is licensed under the Apache License, Version 2.0 - see the LICENSE file for details.

  ## 🤝 Contributing

  Contributions are welcome! Please feel free to submit a Pull Request.

  BUG: Unread Messages Number is not displayed
