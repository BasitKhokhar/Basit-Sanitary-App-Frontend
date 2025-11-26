# 🛁 Basit Sanitary E-Commerce App

An end-to-end e-commerce mobile application focused on the sanitary products industry. Built using **React Native (Expo)** for the frontend and **Node.js + Express** with **MySQL** for the backend. Stripe is integrated for secure online payments.
---
## 🚀 Features

- 🔐 User Authentication (Signup / Login)
- 🛒 Browse and search products by categories & subcategories
- 📦 Add to cart and checkout
- 💳 Secure Stripe payment integration
- 📍 Address & delivery info management
- 🧾 Order summary screen
- 🧑 User profile & account details
- 🧰 Admin/backend for managing products, categories, and users
- 🧠 Data stored using MySQL, with images handled via Firebase
- 📱 Developed using Expo Go for easy testing and deployment

---

## 📦 Tech Stack

### Frontend
- React Native (Expo)
- React Navigation
- Stripe SDK
- AsyncStorage

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Bcrypt for password hashing
- Stripe API
- Firebase (for storing product images)

---

## 📁 Project Structure
project-root/
├── backend/
│ ├── server.js
│ ├── routes/
│ ├── controllers/
│ └── .env
├── frontend/
│ ├── App.js
│ ├── components/
│ ├── screens/
│ └── app.config.js
├── .env # for frontend (Expo)
├── .gitignore
└── README.md
---

## 🔐 Environment Variables

### Backend `.env`:
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
STRIPE_SECRET_KEY=...

shell
Copy
Edit

### Frontend `.env` (in root):
STRIPE_PUBLISHABLE_KEY=...
API_BASE_URL=http://your-backend-url

yaml
Copy
Edit

---

## 🚀 Running the App

### 1. Backend
```bash
cd backend
npm install
node server.js
2. Frontend
bash
Copy
Edit
npm install
npx expo start
📝 License
This project is for educational and demonstration purposes. All rights reserved to Basit Khokhar.

yaml
Copy
Edit

---

Let me know if you'd like a [Markdown file download](f) or a [version with screenshots](f).
