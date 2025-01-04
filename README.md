# Jira Clone Fullstack

A full-stack Jira clone application built with modern web technologies. This project provides a comprehensive task management system with workspaces, tasks, and user collaboration features.

## 🚀 Tech Stack

### Frontend
- **Next.js** - React framework for production
- **TailwindCSS** - Utility-first CSS framework
- **React Query** (@tanstack/react-query) - Data fetching and state management
- **React Table** (@tanstack/react-table) - Table management
- **Axios** - HTTP client

### Backend
- **Node.js** & **Express** - Server framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Express Rate Limit** - API rate limiting
- **Express Mongo Sanitize** - Security middleware

## 🏗️ Project Structure

```
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # Reusable components
│   │   ├── features/       # Feature-based modules
│   │   └── ...
│   └── public/             # Static files
│
├── backend/                 # Express backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── utils/             # Utility functions
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd jira-clone-fullstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create `.env` files in both frontend and backend directories
   - Configure necessary environment variables

4. **Start Development Servers**
   ```bash
   # Run both frontend and backend
   npm run dev

   # Run frontend only
   npm run client

   # Run backend only
   npm run server
   ```

## 🌟 Features

- **Workspace Management**
  - Create and manage multiple workspaces
  - Workspace-specific task organization

- **Task Management**
  - Create, update, and delete tasks
  - Task status tracking
  - Task assignments

- **User Interface**
  - Modern, responsive design
  - Table and board views for tasks
  - Dynamic navigation

## 🔒 Security Features

- Password hashing with bcrypt
- Rate limiting for API endpoints
- MongoDB query sanitization
- Environment variable protection

## 📝 Scripts

- `npm start` - Start production servers
- `npm run dev` - Start development servers
- `npm run client` - Start frontend only
- `npm run server` - Start backend only

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
