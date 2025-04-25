# Mentoring Platform

This is a complete platform that connects mentees and mentors. It includes a **Backend API** built using Node.js, Express, TypeScript, and MongoDB, and a **Frontend** built using React, TypeScript, and TailwindCSS.

## Features

### Backend - Mentoring Platform

- **User Management**: Signup, Login, and Google OAuth using Passport.js.
- **Authentication & Authorization**: JWT authentication for secured access.
- **File Uploads**: Profile and document uploads using Multer and Cloudinary.
- **Scheduling**: Mentor slot booking using RRULE for recurring schedules.
- **Real-Time Communication**: Chat using Socket.IO.
- **Video Calls**: One-to-one video calls using WebRTC.
- **Notifications**: Real-time notifications using Socket.IO.
- **Payments**: Stripe integration for mentor bookings.
- **Logging**: Efficient logging using Morgan.
- **Rate Limiting**: Protection against DDOS attacks using Express-Rate-Limit.
- **Security**: HTTP security headers using Helmet.
- **Error Handling**: Centralized error management.

### Frontend - Mentoring Platform

- **User Authentication**: Sign up, login, and Google OAuth.
- **Profile Management**: Edit profiles and upload images.
- **Slot Booking**: Mentees can book available mentor slots.
- **Real-Time Chat**: Instant messaging using Socket.IO.
- **Video Calls**: One-to-one video call functionality with WebRTC.
- **Notifications**: Real-time notifications for messages and bookings.
- **Payment Integration**: Booking payments via Stripe.
- **Responsive UI**: Designed using TailwindCSS and Material UI.
- **Form Validation**: Secure and structured form handling using Yup.
- **Error Handling**: User-friendly error notifications using React Toastify.

---

## Tech Stack

### Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB**
- **Socket.IO**
- **WebRTC**
- **Cloudinary**
- **Multer**
- **Stripe**
- **Passport.js**
- **RRULE**
- **Nodemailer**
- **Helmet**
- **Express-Rate-Limit**
- **Morgan**

### Frontend

- **React**
- **TypeScript**
- **TailwindCSS**
- **React Router**
- **Material UI**
- **Lucide React Icons**
- **Moment.js** (Date management)
- **React Toastify** (Notifications)
- **Yup** (Form Validation)
- **Vite** (Project Setup)

---

## Backend Configuration

Configure environment variables by creating a `.env` file:

```dotenv
# PORT
PORT

# MONGO
MONGO_URL
NODE_ENV

# NODEMAILER
NODE_MAILER_PASS
NODE_MAILER_EMAIL

# JWT
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_EXPIRY
COOKIE_SECRET

# CLOUDINARY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

# GOOGLE AUTH
GOOGLE_CLIENT_ID    
GOOGLE_CLIENT_SECRET
CALLBACK_URL
SESSION_SECRET

# PAYMENT COMMISSION
PLATFORM_COMMISION
MENTOR_COMMISION 

# STRIPE
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
CLIENT_ORIGIN_URL
```

### Start the backend server:

```bash
npm run dev
```

---

## Security Measures

- **Helmet**: Secures HTTP headers.
- **Rate Limiting**: Uses `express-rate-limit` to prevent brute force attacks.
- **JWT Tokens**: Secure authentication.
- **MongoDB Validation**: Prevents NoSQL injections.

---

## Frontend Features

- **React** for building user interfaces.
- **TailwindCSS** and **Material UI** for styling and responsive design.
- **React Toastify** for error notifications.
- **Yup** for form validation.
- **Socket.IO** for real-time communication.

---

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue to discuss what you would like to change.

---

## License

This project is licensed under the MIT License.