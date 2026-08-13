# Bank Transaction Ledger API

A backend REST API for managing users and bank transactions. The system provides secure user authentication and transaction management using Node.js, Express.js, MongoDB, and JWT.

## 🚀 Features

- User registration and login
- JWT-based authentication
- Secure protected API routes
- Create bank transactions
- Retrieve transaction records
- Update transaction details
- Delete transactions
- MongoDB database integration
- Password hashing and secure authentication
- RESTful API architecture
- Environment-based configuration

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Password Security:** bcrypt
- **API Testing:** Postman
- **Version Control:** Git & GitHub

## 📁 Project Structure

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
