# Event Management API

A backend API built with Node.js, Express, and MongoDB for managing events and event bookings.

This project was created while learning backend development concepts such as authentication, authorization, resource ownership, file uploads, and REST API design. The application allows administrators to manage events while authenticated users can browse events and create bookings.

---

## Project Context

The primary focus of this project was exploring:

* JWT-based authentication
* Role-based authorization
* Event ownership validation
* File uploads with Multer
* Event booking workflows
* REST API development with Express
* MongoDB data modeling with Mongoose

The project uses an event management system as a practical example for implementing these concepts.

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing with bcrypt
* Protected routes

### Event Management

* Create events
* View available events
* Update events
* Delete events
* Upload event images

### Booking Management

* Create event bookings
* View personal bookings
* View all bookings (admin)

### Authorization

* Admin-only event management
* Admin-only booking access
* Event ownership validation
* Protected API routes

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcrypt

### File Uploads

* Multer

### Validation

* validator.js

### Templating

* EJS

---

## Project Structure

```text
controllers/      Request handling logic
middleware/       Authentication, authorization, and upload middleware
models/           MongoDB schemas
routes/           API route definitions
utils/            Validation utilities
views/            EJS templates
uploads/          Uploaded event images
public/           Static assets
app.js            Application entry point
```

---

## Installation

### Prerequisites

* Node.js
* MongoDB Atlas account or local MongoDB instance

### Clone the Repository

```bash
git clone <repository-url>
cd event-management-api
```

### Install Dependencies

```bash
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update the values as required for your environment.

Refer to `.env.example` for the complete list of configuration variables.

### Start the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## Authorization Model

### User

Authenticated users can:

* View available events
* Create bookings
* View their own bookings

### Admin

Administrators can:

* Create events
* Update events
* Delete events
* View all bookings

Event modification routes are protected through ownership validation and role-based authorization.

---

## API Overview

### Authentication

```http
POST /auth/signup
POST /auth/login
```

### Events

```http
GET    /api/events/events
POST   /api/events/events
PUT    /api/events/events/:id
DELETE /api/events/events/:id
```

### Bookings

```http
GET    /api/bookings/my-bookings
GET    /api/bookings/bookings
POST   /api/bookings/bookings/:eventId
```

---

## File Uploads

Event images are uploaded using Multer and stored locally in the `uploads/` directory.

Uploaded files are served through:

```text
/uploads/<filename>
```

---

## Limitations

This repository reflects an early learning project and intentionally focuses on core backend concepts.

Current limitations include:

* No automated test suite
* No API documentation (Swagger/OpenAPI)
* No CI/CD pipeline
* No rate limiting
* Local file storage for uploads
* Limited production hardening

---

## Repository Status

This repository is preserved as a learning project demonstrating:

* Express API development
* MongoDB integration
* JWT authentication
* Role-based authorization
* Event ownership validation
* File uploads with Multer
* Event booking workflows

The project is not actively maintained and primarily serves as a reference for the backend concepts explored during development.
