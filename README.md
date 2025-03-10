# Task Management Application

A full-stack task management application built with React.js and Node.js, featuring user authentication and CRUD operations for tasks.

## Features

- User authentication (Sign up, Sign in)
- Create, Read, Update, and Delete tasks
- Responsive design using Material-UI
- State management with Redux Toolkit
- JWT-based authentication
- MongoDB database integration

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Project Structure

```
project/
├── backend/              # Backend server code
│   ├── middleware/      # Authentication middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── .env           # Environment variables
│   ├── db.js          # Database configuration
│   ├── index.js       # Server entry point
│   └── package.json   # Backend dependencies
└── frontend/           # Frontend React application
    ├── public/        # Static files
    ├── src/          # Source files
    │   ├── components/  # React components
    │   ├── features/   # Redux slices
    │   ├── store/      # Redux store
    │   ├── App.jsx    # Main application component
    │   └── index.js   # Frontend entry point
    └── package.json   # Frontend dependencies
```

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-secret-key
SALT = 10
```

4. Start the backend server:
```bash
node index.js
```

The server will run on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend application:
```bash
npm start
```

The application will run on http://localhost:3000

## API Documentation

### Authentication Endpoints

#### Sign Up
- **POST** `/api/users`
- **Body**: 
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

#### Sign In
- **POST** `/api/auth`
- **Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### Create Task
- **POST** `/api/tasks`
- **Body**:
```json
{
  "title": "string",
  "description": "string",
  "status": "pending|in-progress|completed"
}
```

#### Get All Tasks
- **GET** `/api/tasks`

#### Get Task by ID
- **GET** `/api/tasks/:id`

#### Update Task
- **PUT** `/api/tasks/:id`
- **Body**:
```json
{
  "title": "string",
  "description": "string",
  "status": "pending|in-progress|completed"
}
```

#### Delete Task
- **DELETE** `/api/tasks/:id`

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt

### Frontend
- React.js
- Redux Toolkit
- Material-UI
- Axios
- React Router DOM

## Error Handling

The application includes comprehensive error handling:
- Backend validation errors
- Authentication errors
- Database errors
- Frontend form validation
- API error handling

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected routes
- Input validation
- CORS protection


## Common Issues and Solutions

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally
   - Check MongoDB connection string in .env file
   - Verify network connectivity

2. **JWT Authentication Error**
   - Check if token is properly stored after login
   - Verify token format in Authorization header
   - Ensure JWT_SECRET in .env matches between updates

3. **CORS Error**
   - Check if CORS is properly configured in backend
   - Verify frontend API URL matches backend URL
   - Ensure proper headers are being sent


## Contact

Project Link: [https://github.com/Yugalsaini123/ToDo-list-app](https://github.com/Yugalsaini123/ToDo-list-app)