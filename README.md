# 📝 Highway Delight Assignment - Notes Management System

A full-stack web application for secure note management with OTP-based authentication, built with modern technologies and best practices.

## 🌟 Overview

This project is a comprehensive notes management system that allows users to create, view, edit, and manage their personal notes securely. The application features a robust authentication system using OTP (One-Time Password) verification via email, ensuring maximum security for user accounts.

## 🚀 Features

### 🔐 Authentication & Security
- **OTP-based Authentication**: Secure login and signup using email verification
- **JWT Token Management**: Stateless authentication with JSON Web Tokens
- **Email Validation**: Real-time email format validation
- **Database Verification**: Smart validation checking user existence before operations
- **Protected Routes**: Route protection for authenticated users only

### 📝 Note Management
- **Create Notes**: Add new notes with title and content
- **View Notes**: Read-only view with clean typography
- **Edit Notes**: Dedicated editing interface with form validation
- **Delete Notes**: Remove unwanted notes with confirmation
- **Auto-Navigation**: Seamless navigation between different views

### 💌 Email System
- **Professional Email Templates**: HTML-formatted emails with branding
- **Purpose-based Messaging**: Different templates for signup, login, and resend
- **Security Warnings**: Built-in security notices in email communications
- **10-minute OTP Expiry**: Balanced security and user experience

### 🎨 User Experience
- **Responsive Design**: Mobile-first design approach
- **Clean UI**: Modern and intuitive user interface
- **Real-time Feedback**: Instant validation and error messages
- **Loading States**: User-friendly loading indicators
- **Character Limits**: Smart input validation with character counters

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Server-side type safety
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token for authentication
- **Nodemailer** - Email service integration
- **Express Validator** - Request validation middleware

### Development Tools
- **Nodemon** - Auto-restart development server
- **ESLint** - Code linting and formatting
- **VS Code** - Recommended development environment

## 📁 Project Structure

```
HighwayDelightAssignment/
├── backend/                     # Server-side application
│   ├── controllers/            # Route handlers
│   │   ├── notes.controller.ts # Note CRUD operations
│   │   └── user.controller.ts  # Authentication logic
│   ├── db/                     # Database configuration
│   │   └── db.ts              # MongoDB connection
│   ├── middleware/             # Custom middleware
│   │   └── auth.ts            # JWT authentication middleware
│   ├── models/                 # Database schemas
│   │   ├── notes.model.ts     # Note schema definition
│   │   └── user.model.ts      # User schema definition
│   ├── routes/                 # API route definitions
│   │   ├── notes.routes.ts    # Note endpoints
│   │   └── user.routes.ts     # Authentication endpoints
│   ├── services/               # Business logic services
│   │   └── user.service.ts    # Email and validation services
│   ├── .env                   # Environment variables
│   ├── app.ts                 # Express application setup
│   ├── server.ts              # Server entry point
│   └── package.json           # Dependencies and scripts
├── frontend/                   # Client-side application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── ProtectedRoute.tsx # Route protection
│   │   │   └── PublicRoute.tsx    # Public route wrapper
│   │   ├── routes/            # Application routing
│   │   │   └── AppRoutes.tsx  # Main route configuration
│   │   ├── screens/           # Page components
│   │   │   ├── Dashboard.tsx  # Main dashboard view
│   │   │   ├── Notes.tsx      # Note creation interface
│   │   │   ├── NoteView.tsx   # Read-only note display
│   │   │   ├── NoteEdit.tsx   # Note editing interface
│   │   │   ├── SignIn.tsx     # Login page
│   │   │   └── SignUp.tsx     # Registration page
│   │   ├── services/          # API service layer
│   │   │   ├── api.ts         # Base API configuration
│   │   │   ├── authService.ts # Authentication API calls
│   │   │   └── notesService.ts # Note management API calls
│   │   ├── App.tsx            # Root application component
│   │   └── main.tsx           # Application entry point
│   ├── public/                # Static assets
│   ├── package.json           # Dependencies and scripts
│   └── vite.config.ts         # Vite configuration
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v20.19+ or v22.12+)
- **MongoDB** (Local instance or MongoDB Atlas)
- **Gmail Account** (For email service)

### 1. Clone Repository
```bash
git clone https://github.com/Anujahirwar01/HighwayDelightAssignment.git
cd HighwayDelightAssignment
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/highway-delight

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Server Configuration
PORT=3000
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Start Development Servers

**Backend Server:**
```bash
cd backend
npm run dev
# Server will start on http://localhost:3000
```

**Frontend Server:**
```bash
cd frontend
npm run dev
# Client will start on http://localhost:5173
```

## 📧 Email Setup Guide

### Gmail Configuration
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. **Update .env file** with your email and app password

### Email Templates
The system automatically sends different email templates:
- **Signup**: Welcome message with verification code
- **Login**: Login verification with security warnings
- **Resend**: Resend verification for unverified accounts

## 🔒 API Endpoints

### Authentication Routes
```
POST /api/users/signup          # User registration
POST /api/users/verify-otp      # Email verification
POST /api/users/login           # User login
POST /api/users/verify-login    # Login OTP verification
POST /api/users/resend-otp      # Resend verification code
```

### Note Management Routes
```
GET    /api/notes               # Get all user notes
POST   /api/notes               # Create new note
GET    /api/notes/:id           # Get specific note
PUT    /api/notes/:id           # Update note
DELETE /api/notes/:id           # Delete note
```

## 🔐 Authentication Flow

### Signup Process
1. User provides email, name, and age
2. System validates email format and checks for duplicates
3. OTP generated and sent via email
4. User verifies OTP to activate account
5. JWT token issued for authenticated sessions

### Login Process
1. User provides email address
2. System validates email exists and is verified
3. Login OTP sent to registered email
4. User verifies OTP to complete login
5. JWT token issued for session management

## 📱 User Interface Flow

### Navigation Structure
```
├── Public Routes
│   ├── /signin                 # Login page
│   └── /signup                 # Registration page
├── Protected Routes
│   ├── /dashboard              # Main dashboard
│   ├── /notes                  # Create new note
│   ├── /note/:id               # View specific note
│   └── /note/:id/edit          # Edit specific note
```

### User Journey
1. **Registration**: Sign up with email verification
2. **Dashboard**: View all notes with quick actions
3. **Create**: Add new notes with title and content
4. **View**: Read notes in clean, formatted layout
5. **Edit**: Modify existing notes with form validation
6. **Delete**: Remove notes with confirmation

## 🛡️ Security Features

### Input Validation
- Email format validation
- Character limits on inputs
- XSS prevention through proper sanitization
- SQL injection prevention with Mongoose

### Authentication Security
- JWT token expiration (1 hour)
- OTP expiration (10 minutes)
- Password-less authentication
- Session management

### Data Protection
- MongoDB schema validation
- Encrypted JWT tokens
- Secure HTTP headers
- Environment variable protection

## 🚀 Deployment

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB URI
- [ ] Set up production email service
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password
PORT=3000
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with valid email
- [ ] OTP verification process
- [ ] User login flow
- [ ] Note creation and validation
- [ ] Note editing functionality
- [ ] Note deletion with confirmation
- [ ] Protected route access
- [ ] Email delivery verification

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React hooks patterns
- Implement proper error handling
- Add meaningful comments
- Use consistent naming conventions

### Best Practices
- Validate all inputs
- Handle errors gracefully
- Use environment variables for secrets
- Implement proper logging
- Follow RESTful API conventions

## 🐛 Troubleshooting

### Common Issues

**Email not sending:**
- Check Gmail app password setup
- Verify environment variables
- Ensure 2FA is enabled on Gmail

**MongoDB connection issues:**
- Verify MongoDB is running
- Check connection string in .env
- Ensure database permissions

**Frontend build errors:**
- Check Node.js version compatibility
- Clear node_modules and reinstall
- Verify all dependencies are installed

**JWT token issues:**
- Check JWT_SECRET configuration
- Verify token expiration settings
- Ensure proper token storage

## 📞 Support

For support and questions:
- **GitHub Issues**: [Create an issue](https://github.com/Anujahirwar01/HighwayDelightAssignment/issues)
- **Email**: [Contact Developer](mailto:anujahirwar01@gmail.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React and Node.js communities
- MongoDB documentation
- Nodemailer service
- Express.js framework
- TypeScript team

---

**Built with ❤️ by [Anuj Ahirwar](https://github.com/Anujahirwar01)**

*Last updated: August 31, 2025*
