# Blood Donation Management System

A full-stack Blood Donation Management System developed to streamline blood donation, donor management, hospital requests, and blood request tracking.

The system enables donors, hospitals, and administrators to interact through a secure platform for blood donation management.

## Features

### Authentication & Authorization
- User Registration and Login
- JWT Authentication
- Role-Based Access Control
- Secure API Access

### Donor Module
- Donor Registration
- Donor Profile Management
- Eligible Blood Requests
- Donation History Tracking

### Hospital Module
- Create Blood Requests
- Manage Blood Requests
- Approve Donations
- Hospital Dashboard

### Admin Module
- User Management
- Donor Management
- Hospital Management
- Request Monitoring
- Donation Monitoring

### Blood Request Management
- Create Blood Requests
- Track Request Status
- Expiry Scheduler for Requests
- Urgency Level Management

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Context API
- Axios

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- REST API
- Maven

### Database
- MySQL

### Tools
- Git & GitHub

---

## Project Structure

```txt
blood_donation/
│
├── blood-tracking-system-backend/
│   └── blood-donation-system/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       ├── security/
│       └── scheduler/
│
├── frontend_for_blood/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── context/
│   │   └── api/
│
└── README.md
```

---

## System Roles

### Donor
- Register as donor
- View eligible requests
- Donate blood
- View donation history

### Hospital
- Create blood requests
- Approve donations
- Manage requests

### Admin
- Monitor users
- Manage hospitals
- Track donations
- Monitor blood requests

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/saswanth07/blood_donation.git
cd blood_donation
```

---

## Backend Setup (Spring Boot)

Go to backend folder:

```bash
cd blood-tracking-system-backend/blood-donation-system
```

Install dependencies and run:

```bash
mvn spring-boot:run
```

Backend runs on:

```txt
http://localhost:8080
```

### Configure Database

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blood_donation
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

## Frontend Setup (React + Vite)

Open a new terminal:

```bash
cd frontend_for_blood
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## API Features

- JWT Authentication
- Role-Based Authorization
- Blood Request APIs
- Donation APIs
- Donor APIs
- Hospital APIs
- Admin APIs

---

## Security

- JWT Token Authentication
- Spring Security
- Protected Routes
- Role-Based Access Control

---

## Future Improvements

- Email Notifications
- SMS Alerts
- Blood Availability Analytics
- Deployment on Cloud
- Real-Time Notifications

---

## Screenshots

Add screenshots here after deployment.

Example:

```md
![Home Page](images/home.png)
```

---

## Author

**Saswanth**

GitHub: https://github.com/saswanth07

---

## License

This project is for educational purposes.
