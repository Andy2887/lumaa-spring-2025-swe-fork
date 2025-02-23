# Full Stack Task Manager

A task management application built with React, TypeScript, Express, and PostgreSQL.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Database Setup

```sql
CREATE DATABASE taskmanager;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    userid INTEGER REFERENCES users(id)
);
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The server will run on http://localhost:3005

### Frontend Setup

```bash
cd my-app
npm install
npm start
```

The application will run on http://localhost:3000

## Salary Expectation

I expect $3000/month