Aeroflow – Flight Booking System ✈️
Live Website: https://aero-flow-bookings.com/

Team 21 | CP317A Group Project | Fall 2025

Quick Setup Guide
1. Install Node.js
Download from: nodejs.org

Choose version 18 or higher

Verify: Open terminal and run:

bash
node --version
npm --version
2. Download & Extract
Download project ZIP

Extract to Desktop → Should create Desktop/aeroflow/

Setup Instructions
macOS / Linux
bash
# Backend setup
cd ~/Desktop/aeroflow/backend
npm install
npm start

# In NEW terminal window
cd ~/Desktop/aeroflow/frontend
npm install
npm run dev
Windows (PowerShell)
powershell
# Backend setup
cd C:\Users\$env:USERNAME\Desktop\aeroflow\backend
npm install
npm start

# In NEW PowerShell window
cd C:\Users\$env:USERNAME\Desktop\aeroflow\frontend
npm install
npm run dev
Windows (Command Prompt)
cmd
:: Backend setup
cd C:\Users\%USERNAME%\Desktop\aeroflow\backend
npm install
npm start

:: In NEW Command Prompt window
cd C:\Users\%USERNAME%\Desktop\aeroflow\frontend
npm install
npm run dev
Access the Application
Frontend: Open browser to http://localhost:3000

Backend: Running at http://localhost:5000

Note: Initial load may take 1-2 minutes. If you see "Cannot connect," wait and refresh.

Live Website (No Installation)
Use: https://aero-flow-bookings.com/

Demo Credentials:

Traveler: demo@traveler.com / demo123

Admin: admin@aeroflow.com / admin123

Troubleshooting
"npm: command not found" → Reinstall Node.js

Port already in use → Run: npx kill-port 3000 5000

Slow loading → Wait 2 minutes, then refresh browser

Installation errors → Delete node_modules and run npm install again

Quick Test
Open localhost:3000

Click "Search Flights"

Select Toronto → Vancouver

Choose flight and seat

Apply code: WELCOME10

Complete checkout

Team 21 | CP317A | Fall 2025

