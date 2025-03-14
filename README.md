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
      # Server configuration
      PORT=8000
      BACKEND_URL='http://localhost:8000'

      # Bull configuration
      BULL_PORT=6379
      BULL_HOST_URL='your-bull-host-url'
      BULL_PASSWORD='your-bull-password'

      # Security keys (ensure these are kept secure)
      JWT_SEC_KEY='your-jwt-sec-key'
      SESSION_SECRET='your-session-secret'

      # Database configuration
      MONGOOSE_URL='your-mongoose-url'

      # Google OAuth configuration
      GOOGLE_CLIENT_ID="your-google-client-id"
      GOOGLE_CLIENT_SECRET="your-google-client-secret"

      # Mailer configuration
      MAILER_EMAIL="your-mailer-email"
      MAILER_PASS="your-mailer-pass"

      # CORS configuration
      CORS_ORIGIN="*"

      # Bcrypt configuration
      BCRYPT_SALTS=10

      # Cloudinary configuration
      CLOUDINARY_CLOUD_NAME='your-cloudinary-cloud-name'
      CLOUDINARY_API_KEY='your-cloudinary-api-key'
      CLOUDINARY_API_SECRET='your-cloudinary-api-secret'
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
