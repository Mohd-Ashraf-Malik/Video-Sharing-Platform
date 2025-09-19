# Video-Sharing Platform Backend

A comprehensive backend system for a video-sharing platform built with Node.js and Express.js, providing core functionality for video management, user authentication, social interactions, and content organization.

## 🚀 Features

- **User Authentication**: JWT-based authentication with refresh token support
- **Video Management**: Upload, streaming, and management with cloud storage
- **Social Features**: Comments, likes, tweets, and subscriptions
- **Content Organization**: Playlist creation and management
- **Analytics Dashboard**: User analytics and statistics
- **File Upload**: Multipart file upload with temporary storage and cloud persistence

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js with ES6 modules
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for session management
- **Authentication**: JSON Web Tokens (JWT)

### Dependencies
```json
{
  "bcrypt": "^5.1.1",           // Password hashing
  "cloudinary": "^2.5.1",      // Cloud storage and CDN
  "cookie-parser": "^1.4.7",   // Cookie parsing middleware
  "cors": "^2.8.5",            // Cross-origin resource sharing
  "dotenv": "^16.4.7",         // Environment variable management
  "express": "^4.21.2",        // Web application framework
  "jsonwebtoken": "^9.0.2",    // JWT implementation
  "mongoose": "^8.9.5",        // MongoDB object modeling
  "mongoose-aggregate-paginate-v2": "^1.1.2", // Pagination support
  "multer": "^1.4.5-lts.1",    // File upload handling
}
```

### Development Tools
- **nodemon**: Development server with auto-restart
- **prettier**: Code formatting

## 📁 Project Structure

```
src/
├── app.js                 # Express app configuration
├── index.js              # Application entry point
├── constants.js          # Application constants
├── connections/
│   ├── db/               # Database connection
├── models/               # Mongoose data models
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   └── tweet.model.js
├── controllers/          # Business logic
├── routes/              # API route definitions
├── middlewares/         # Custom middleware
└── utils/              # Utility functions
```

## 🗄️ Database Models

### User Model
- Authentication with bcrypt password hashing
- JWT token generation (access & refresh tokens)
- Avatar and cover image support via Cloudinary
- Watch history tracking

### Video Model
- Cloud storage integration with Cloudinary
- Thumbnail and video file management
- View tracking and publication status
- Owner relationship and watched users tracking

### Social Models
- **Comments**: Video commenting system with pagination
- **Likes**: Polymorphic likes for videos, comments, and tweets
- **Playlists**: User-curated video collections
- **Tweets**: Standalone user posts
- **Subscriptions**: Channel following system

## 🔧 API Endpoints

All endpoints are prefixed with `/api/v1/`:

- `/users` - User authentication and profile management
- `/videos` - Video upload, streaming, and management
- `/comments` - Comment system for videos
- `/like` - Like/unlike functionality
- `/tweet` - Tweet creation and management
- `/playlist` - Playlist operations
- `/subscription` - Channel subscription management
- `/dashboard` - Analytics and user statistics
- `/healthcheck` - System health monitoring

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDb
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Video-Sharing-Platform
```

2. Install dependencies
```bash
npm install
```

3. Environment Setup
Create a `.env` file with the following variables:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=your_frontend_url
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development server
```bash
npm run dev
```

## 🏗️ Architecture

The application follows a layered architecture:

1. **Entry Point**: `src/index.js` - Environment setup and server initialization
2. **Application Layer**: `src/app.js` - Express configuration and middleware
3. **Route Layer**: API route definitions with versioning
4. **Controller Layer**: Business logic and request handling
5. **Model Layer**: Database schemas and operations
6. **Utility Layer**: Helper functions and middleware

## 🔐 Authentication

- JWT-based authentication with access and refresh tokens
- Secure password hashing using bcrypt
- Cookie-based token storage with fallback to Authorization headers
- Middleware-based route protection

## 📤 File Upload

- Multer middleware for handling multipart uploads
- Temporary local storage in `./public/temp`
- Automatic upload to Cloudinary for persistence
- Support for video files and thumbnails

## 🔄 Database Features

- Mongoose ODM with automatic timestamps
- Aggregate pagination for efficient data loading
- Reference relationships between models
- Indexing for optimized queries

## 📊 Monitoring

- Health check endpoints for system monitoring
- Error handling with custom API responses
- Logging for debugging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC License

## 👨‍💻 Author

Mohd Ashraf Malik

---

**Note**: This project is part of the "Chai aur Code" YouTube channel educational content.
```

## Notes

This README provides comprehensive coverage of the Video-Sharing-Platform's technical architecture based on the codebase analysis. [2](#1-1)  The structure includes all major components like the Express.js setup, MongoDB models, authentication system, and cloud storage integration. [3](#1-2) [4](#1-3) 

The README covers the complete tech stack from the package.json dependencies and provides practical setup instructions for developers wanting to run or contribute to the project.

Wiki pages you might want to explore:
- [Overview (Mohd-Ashraf-Malik/Video-Sharing-Platform)](/wiki/Mohd-Ashraf-Malik/Video-Sharing-Platform#1)
- [Social Models (Mohd-Ashraf-Malik/Video-Sharing-Platform)](/wiki/Mohd-Ashraf-Malik/Video-Sharing-Platform#6.3)

### Citations

**File:** package.json (L1-34)
```json
{
  "name": "chai-backend",
  "version": "1.0.0",
  "description": "a backend in at chai aur code channel - youtube",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  },
  "keywords": [
    "javascript",
    "backend",
    "chai"
  ],
  "author": "Mohd Ashraf Malik",
  "license": "ISC",
  "devDependencies": {
    "nodemon": "^3.1.9",
    "prettier": "^3.4.2"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cloudinary": "^2.5.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.5",
    "mongoose-aggregate-paginate-v2": "^1.1.2",
    "multer": "^1.4.5-lts.1"
  }
```

**File:** src/app.js (L17-37)
```javascript
//routes import
import userRouter from './routes/user.routes.js'
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import likeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
app.use('/api/v1/users',userRouter);
app.use('/api/v1/videos',videoRouter);
app.use('/api/v1/comments',commentRouter);
app.use('/api/v1/healthcheck',healthcheckRouter);
app.use('/api/v1/like',likeRouter);
app.use('/api/v1/tweet',tweetRouter);
app.use('/api/v1/playlist',playlistRouter)
app.use('/api/v1/subscription',subscriptionRouter)
app.use('/api/v1/dashboard',dashboardRouter)
```

**File:** src/models/user.model.js (L63-89)
```javascript
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            // we will use it in auth.middleware.js
            _id: this._id,
            username: this.username,
            fullName: this.fullName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
```

**File:** src/utils/cloudinary.js (L11-31)
```javascript
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            console.log("Local file path is not provided");
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        
        // console.log("File uploaded successfully",response.url);

        fs.unlinkSync(localFilePath);

        return response
    } catch (error) {
        fs.unlinkSync(localFilePath);  // remove the locally save
        // tempory file path as the upload failed
    }
    
}
```
