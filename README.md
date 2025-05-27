AUDIT MANAGEMENT SYSTEM

A full-stack Audit Management application built with Next.js (App Router), Express.js, MongoDB, and Supabase Storage. This app allows authenticated users to perform audits, upload images, and manage outlet details efficiently.

---

FEATURES

- JWT-based authentication with HttpOnly cookies
- Image upload via Supabase Storage
- Outlet audits with location, cleanliness, and photos
- Dashboard with authenticated user experience
- Fully RESTful API with Express backend
- MongoDB for persistent audit and user data

---

TECH STACK

Frontend:
- Next.js (App Router)
- Tailwind CSS
- Axios

Backend:
- Express.js
- MongoDB & Mongoose
- JWT
- Supabase Storage
- Multer

---

GETTING STARTED

1. Clone the repository

   git clone https://github.com/yourusername/audit-system.git
   cd audit-system

2. Create environment variables

   In /server/.env:
     MONGO_URL=your_mongodb_url
     ACCESS_TOKEN_SECRET=your_jwt_secret
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_KEY=your_supabase_anon_key

   In /app/.env.local:
     NEXT_PUBLIC_API_BASE=http://localhost:3001

3. Install dependencies

   Backend:
     cd server
     npm install
     npm run dev

   Frontend:
     cd app
     npm install
     npm run dev

4. Visit in browser:
   Frontend: http://localhost:3000
   Backend: http://localhost:3001

---

API ROUTES

POST   /register    - Register a new user
POST   /login       - Login and set JWT cookie
GET    /user        - Get logged-in user info
POST   /audit       - Submit an audit with images

---

SUPABASE IMAGE UPLOAD

Uploaded images are stored in Supabase Storage and made public via getPublicUrl.

---

AUTHOR

Divyansh Sharma - https://github.com/divyan154

---

LICENSE

MIT License
