# 🏦 Bank Transaction Ledger API

A backend banking ledger system built with **Node.js, Express.js, MongoDB, and JWT authentication**. The project provides RESTful APIs for user authentication and managing bank transaction records.

The project is being developed as a practical backend application to understand how authentication, database operations, REST APIs, middleware, and transaction management work together in a real-world system.

---

## 🚀 Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing
* Protected API routes

### Transaction Management

* Create transactions
* Retrieve transaction records
* Retrieve a transaction by ID
* Update transaction details
* Delete transactions
* User-specific transaction access

### Backend

* RESTful API architecture
* MongoDB database integration
* Mongoose ODM
* Express.js routing
* Authentication middleware
* Environment-based configuration
* API testing with Postman

---

## 🛠️ Tech Stack

| Technology   | Purpose            |
| ------------ | ------------------ |
| Node.js      | JavaScript runtime |
| Express.js   | Backend framework  |
| MongoDB      | Database           |
| Mongoose     | MongoDB ODM        |
| JWT          | Authentication     |
| bcrypt       | Password hashing   |
| Postman      | API testing        |
| Git & GitHub | Version control    |

---

## 📂 Project Structure

```text
bank-ledger-backend/
│
├── controllers/
│   ├── authController.js
│   └── transactionController.js
│
├── models/
│   ├── User.js
│   └── Transaction.js
│
├── routes/
│   ├── authRoutes.js
│   └── transactionRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── config/
│   └── db.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

> The folder names above should match your actual project structure. If your files are named differently, update this section accordingly.

---

## 🔐 Authentication Flow

The application uses JWT-based authentication to protect transaction-related APIs.

```text
User
 │
 ├── Register
 │       ↓
 │   User stored in MongoDB
 │
 ├── Login
 │       ↓
 │   Credentials verified
 │       ↓
 │   JWT generated
 │
 └── Protected API
         ↓
    JWT verification
         ↓
    Access granted
```

Protected requests use:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## 📌 API Endpoints

### Authentication APIs

| Method | Endpoint             | Description            | Auth |
| ------ | -------------------- | ---------------------- | ---- |
| POST   | `/api/auth/register` | Register a new user    | ❌    |
| POST   | `/api/auth/login`    | Login an existing user | ❌    |

### Transaction APIs

| Method | Endpoint                | Description           | Auth |
| ------ | ----------------------- | --------------------- | ---- |
| POST   | `/api/transactions`     | Create a transaction  | ✅    |
| GET    | `/api/transactions`     | Get transactions      | ✅    |
| GET    | `/api/transactions/:id` | Get transaction by ID | ✅    |
| PUT    | `/api/transactions/:id` | Update a transaction  | ✅    |
| DELETE | `/api/transactions/:id` | Delete a transaction  | ✅    |

> Update the endpoint names above if your actual routes use different paths.

---

## 🧾 Transaction Flow

A typical transaction request works like this:

```text
Client
   ↓
Express Route
   ↓
Authentication Middleware
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
   ↓
Response
```

This separation keeps routing, authentication, business logic, and database operations organized.

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB or a MongoDB Atlas database
* Postman (optional, for API testing)

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/bank-ledger-backend.git
```

### 2. Navigate to the project

```bash
cd bank-ledger-backend
```

### 3. Install dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Important

Never upload your `.env` file to GitHub.

The project uses `.gitignore` to prevent sensitive environment variables from being committed.

A safe `.env.example` file can be included in the repository:

```env
PORT=
MONGO_URI=
JWT_SECRET=
```

---

## ▶️ Running the Application

### Development

If your project uses Nodemon:

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will run on:

```text
http://localhost:5000
```

> Use the port configured in your `.env` file if it is different.

---

## 🧪 API Testing with Postman

The APIs can be tested using Postman.

Recommended testing sequence:

```text
1. Register User
       ↓
2. Login User
       ↓
3. Receive JWT Token
       ↓
4. Add JWT to Authorization Header
       ↓
5. Create Transaction
       ↓
6. Get Transactions
       ↓
7. Get Transaction by ID
       ↓
8. Update Transaction
       ↓
9. Delete Transaction
```

Example authorization header:

```text
Authorization: Bearer <your_jwt_token>
```

---

## 🗄️ Database

The project uses **MongoDB** for persistent data storage.

Mongoose is used to define schemas and interact with MongoDB.

The main data entities are:

### User

Stores user authentication information.

```text
User
├── name
├── email
├── password
└── timestamps
```

### Transaction

Stores transaction information associated with users.

```text
Transaction
├── user
├── amount
├── type
├── description
└── timestamps
```

> Adjust the fields above to match your actual Mongoose schemas.

---

## 🔒 Security

The application implements several basic security practices:

* Passwords are hashed before being stored.
* JWT is used for authentication.
* Protected routes require valid authentication.
* Sensitive environment variables are stored in `.env`.
* `.env` is excluded from Git using `.gitignore`.
* User-specific resources are protected through authentication.

---

## 📊 Current Development Status

### Completed

* [x] Node.js backend setup
* [x] Express.js server
* [x] MongoDB connection
* [x] User registration API
* [x] User login API
* [x] JWT authentication
* [x] Authentication middleware
* [x] Transaction APIs
* [x] MongoDB transaction persistence
* [x] API testing with Postman
* [x] Git/GitHub integration

### Planned Improvements

* [ ] Request validation
* [ ] Centralized error handling
* [ ] Transaction pagination
* [ ] Transaction filtering and search
* [ ] Account balance calculation
* [ ] Transaction statistics
* [ ] Automated unit tests
* [ ] Integration tests
* [ ] Swagger/OpenAPI documentation
* [ ] Dockerization
* [ ] Cloud deployment
* [ ] Rate limiting
* [ ] Additional API security

---

## 📈 Future Architecture

The project can be extended into a more complete banking backend:

```text
                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  REST API    │
                    │   Express    │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       Authentication              Transactions
          Middleware                  Controller
              │                         │
              └────────────┬────────────┘
                           ▼
                    ┌──────────────┐
                    │   Mongoose   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   MongoDB    │
                    └──────────────┘
```

---

## 🎯 Learning Objectives

This project was built to gain practical experience with:

* Backend development with Node.js
* REST API design
* Express.js architecture
* MongoDB and Mongoose
* JWT authentication
* Middleware
* Password security
* CRUD operations
* API testing
* Environment variables
* Git and GitHub workflow

---

## 👨‍💻 Author

**Rishabh Jha**

B.Tech Information Technology Student

---

## ⭐ Project Status

This project is currently under active development. More backend features, testing, security improvements, and deployment capabilities will be added in future versions.
