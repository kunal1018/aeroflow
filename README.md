# aeroflow

AeroFlow is a full airline reservation platform designed with modern UI components, responsive design, and a complete booking flow. It simulates a full end-to-end flight reservation experience including search, seat selection, live flight monitoring, payment steps, and an admin dashboard.

This repository contains the complete source code required for the application along with setup instructions and documentation.

🌐 Live Deployment

The fully functional system is deployed online and accessible at:

👉 https://aero-flow-bookings.com/login?from_url=https%3A%2F%2Faero-flow-bookings.com%2F

The deployed version contains the entire set of features demonstrated in the final demo video.
Evaluators can explore the full system without running the application locally.

Local setup instructions are included below for completeness.

✈️ Key Features
User Features

Flight Search and Filters

Live Flight Status Board

Delay Prediction (AI-assisted)

3D Aircraft Seat Map

Seat Selection

Baggage Selection

Passenger Information Form

Payment Flow (simulated)

Booking Confirmation

My Bookings Dashboard

Admin Features

Add and Manage Flights

View All Bookings

Admin Dashboard

Live System Stats

Interface

Fully responsive UI

Modern component system

TailwindCSS styling

ShadCN UI components

Toast notifications

Clean navigation layout

🛠 Tech Stack
Frontend

React (Vite)

TailwindCSS

ShadCN UI

TanStack Query

Three.js (3D visualization)

Backend

Base44 Backend-as-a-Service

Managed database

API endpoints integrated via Base44 client

No manual server deployment required

Tools

npm

Vite build tool

GitHub version control

📦 Source Code Structure
src/
  api/
    base44Client.js
    entities.js
    integrations.js

  components/
    FlightCard.jsx
    FlightMonitor.jsx
    SeatMap.jsx
    BookingCard.jsx
    ToastContainer.jsx
    ui/ (ShadCN components)
    
  pages/
    Home.jsx
    FlightStatus.jsx
    AdminDashboard.jsx
    SearchResults.jsx
    Payment.jsx
    SeatSelection.jsx
    MyBookings.jsx
    BaggageSelection.jsx
    PassengerForm.jsx
    AdminFlights.jsx
    AdminBookings.jsx

  hooks/
  utils/
  lib/
public/
index.html
package.json
vite.config.js
tailwind.config.js
postcss.config.js


All files needed to run the system are included in this repository.

🚀 Local Setup Instructions

These steps allow the evaluator to run the system locally if desired.
Note: The live deployment link above provides the easiest way to explore the system.

1. Install Node.js

Download from: https://nodejs.org

Version 18 or higher recommended.

2. Clone the Repository
git clone https://github.com/YOUR_USERNAME/AeroFlow.git
cd AeroFlow

3. Install Dependencies
npm install

4. Start Development Server
npm run dev


You will see a link such as:

Local: http://localhost:5173/


Open it in the browser to use the system.

5. Optional: Build for Production
npm run build
