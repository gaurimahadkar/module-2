# Module 02 - Backend Development | Inkspire Blog Application

## About the Project
Inkspire is a full-stack Blog Application developed as part of Module 02 of my internship. It allows users to register, log in, create blog posts, view published stories, edit their own posts, and delete them.

The application connects a frontend interface with a Node.js and Express.js backend using MongoDB as the database.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- REST APIs

### API Testing
- Postman

## Features

### User Authentication
- User Registration
- User Login
- Password Hashing
- JWT-based Authentication

### Blog Management
- Create Blog Posts
- View All Blogs
- View Single Blog
- Update Blog Posts
- Delete Blog Posts
- Blog Categories
- Cover Image URL Preview

### Dashboard
- Personalized User Dashboard
- Total Stories Count
- Recently Created Stories
- Manage Personal Blog Posts
- Edit and Delete Stories

## Project Structure
```text
Inkspire-Blog-Application/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── blogController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env (not uploaded)
│
├── css/
├── js/
├── images/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── README.md
└── .gitignore
```

## Installation and Setup

### 1. Clone the Repository
```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open Backend Folder
```bash
cd backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/inkspire_blog
JWT_SECRET=your_long_random_secret
```

Use your own secure JWT secret.

### 5. Start Backend Server
```bash
npm start
```

If nodemon is configured:
```bash
npm run dev
```

### 6. Run Frontend
Open `index.html` using VS Code Live Server.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### Blog Management
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blogs` | Get all blogs |
| GET | `/api/blogs/:id` | Get single blog |
| POST | `/api/blogs` | Create blog |
| PUT | `/api/blogs/:id` | Update blog |
| DELETE | `/api/blogs/:id` | Delete blog |

## Testing
All major backend API operations were tested using Postman, including:
- User Registration
- User Login
- Create Blog
- Get All Blogs
- Get Single Blog
- Update Blog
- Delete Blog

## Learning Outcomes
- Learned Node.js and Express.js backend development.
- Implemented RESTful APIs.
- Connected MongoDB using Mongoose.
- Implemented JWT authentication.
- Integrated frontend with backend APIs.
- Tested APIs using Postman.
- Implemented CRUD operations.

## Author
Gauri Mahadkar

## Internship
Codomax Internship - Module 02
