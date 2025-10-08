# E-Learning System

A comprehensive E-Learning platform API built with Node.js and TypeScript, featuring role-based access control and multimedia course management.

## Features

### Authentication & Security
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (Admin, Instructor, Student)
- **Password Reset** functionality with email verification codes
- **User Profile Management** with password change capabilities

### Course Management
- **Course Creation & Management** by instructors
- **Section-based Organization** with multimedia lesson support
- **Video Upload & PDF Document** handling
- **Enrollment Code Generation** for student registration
- **Course Content Modification** (Add, Edit, Delete sections and lessons)

### User Roles & Capabilities

#### Instructor
- Create and manage courses
- Add/edit/delete sections and lessons
- Upload multimedia content (videos, PDFs)
- Generate enrollment codes for students
- Monitor course enrollment and student progress

#### Student
- Enroll in courses using instructor-provided codes
- Access course content and lessons
- Update profile information and change password

#### Admin
- User management dashboard
- Activate/deactivate user accounts
- System-wide monitoring and oversight

## Technologies

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer for multimedia content
- **Email Service:** Nodemailer
- **Containerization:** Docker

## Project Structure

```
e-learning-system/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── dto/
│   ├── mapper/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── types/
│   ├── utils/
│   └── app.ts
├── database-design/
├── postman-collection/
├── prisma/
├── templates/
│    └── reset-password.html
├── docker-compose.yml
├── .env
└── package.json
```

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) and Docker Compose

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/gemmy404/e-learning-system.git
cd e-learning-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/elearning_db"
PORT=3000
JWT_SECRET="your-secret-key"
GMAIL_EMAIL="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"
```

**Important Notes:**
- Replace `username` and `password` with your PostgreSQL credentials
- Generate a strong `JWT_SECRET` for production
- Use Gmail App Password (not your regular password) - [How to generate](https://support.google.com/accounts/answer/185833)


### 4. Database Setup
```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d
```
```bash
# Generate Prisma Client
npx prisma generate
```

### 5. Run the Application
```bash
npm run dev
```

## Testing the API

1. Import the Postman collection from `postman-collection/` directory
2. Set up environment variables in Postman
3. Start testing the endpoints

---

⭐ If you found this project helpful, please consider giving it a star!