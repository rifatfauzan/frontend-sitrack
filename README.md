# SiTrack - Tracking Information System for PT. Glorious Interbuana

![SiTrack Banner](sitrack-frontend/src/assets/SiTrack%20-%20README.png)

SiTrack is a comprehensive logistics management system designed specifically for PT. Glorious Interbuana. The application provides complete solutions for managing transportation operations, from vehicle management and customer bookings to reporting and analytics.

## Features

### Master Data Management
- **Vehicle Management**: Registration, editing, and monitoring of vehicles
- **Driver Management**: Driver data management and assignment
- **Customer Management**: Customer database and contact information
- **Chassis Management**: Chassis and container load tracking
- **Asset Management**: Company asset inventory and tracking

### Operations
- **Customer Booking**: Customer booking and scheduling system
- **Vehicle Out/In**: Vehicle entry and exit tracking
- **SPJ (Surat Perintah Jalan)**: Waybill and documentation management
- **Asset Request**: Asset request and allocation system

### Reporting & Analytics
- **Dashboard Analytics**: Operational data visualization with charts and graphs
- **Truck Reports**: Vehicle condition and maintenance reports
- **Commission**: Commission calculation and tracking
- **Notification System**: Real-time notification system

### User Management
- **Multi-role Access**: Admin, Manager, Supervisor, Operational, Mechanic
- **Authentication**: Secure login system
- **Authorization**: Role-based access control

## Tech Stack

- Vue 3 + TypeScript
- Vite
- PrimeVue + Tailwind CSS
- Pinia
- Vue Router

## Prerequisites

Ensure your system has:
- **Node.js** (version 18 or newer)
- **npm** or **yarn**
- **Git**

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd frontend-sitrack/sitrack-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and configure:
```env
VITE_API_URL=http://localhost:3000
PORT=4173
```

### 4. Development Server
```bash
npm run dev
```
The application will run at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

## Development Guide

### Project Structure
```
sitrack-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, styles
│   ├── components/        # Reusable Vue components
│   ├── interfaces/        # TypeScript interfaces
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia stores
│   ├── views/            # Page components
│   └── main.ts           # App entry point
├── package.json
└── vite.config.ts
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```


## Deployment

### Railway Deployment
The application is configured for deployment on Railway:
- Port: 4173 (configurable via environment)
- Host: 0.0.0.0
- Allowed hosts: sitrack.up.railway.app

### Environment Variables
```env
VITE_API_URL=<backend-api-url>
PORT=4173
```

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Secure API communication
- Input validation and sanitization