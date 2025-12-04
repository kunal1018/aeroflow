Aeroflow – Intelligent Flight Booking System ✈️
Team 21 | CP317A Group Project | Fall 2025

https://img.shields.io/badge/Aeroflow-Flight%2520Booking-blue
https://img.shields.io/badge/Node.js-18%252B-green
https://img.shields.io/badge/React-18%252B-blue
https://img.shields.io/badge/License-MIT-yellow

📋 Table of Contents
Project Overview

✨ Features

🌐 Live Deployment

🚀 Local Installation

Prerequisites

Quick Setup

⚙️ Platform-Specific Setup

macOS

Windows

Linux

🎯 Testing the Application

🛠️ Troubleshooting

📁 Project Structure

👥 Team

📄 License

🎯 Project Overview
Aeroflow is a modern, intelligent flight booking system designed for both travelers and airline administrators. The platform offers real-time flight search, interactive seat selection, secure payment processing, discount codes, and an advanced admin dashboard with AI-powered delay predictions and analytics.

Target Users:

Travelers: Book, manage, and track flights seamlessly

Administrators: Monitor operations, manage flights, and analyze trends

Key Technologies:

Frontend: React 18, Vite, Tailwind CSS, shadcn/ui

Backend: Node.js, Express.js

Database: PostgreSQL / SQLite (for demo)

APIs: Flight data, AI predictions, payment simulation

✨ Features
For Travelers:
🔍 Real-time flight search with filters

💺 Interactive seat selection map

💳 Secure payment processing (simulated)

🏷️ Discount code application

📋 Booking management and history

📱 Responsive mobile-friendly design

For Administrators:
📊 Live dashboard with KPIs

📈 Flight trend analytics

🤖 AI-powered delay predictions

✈️ Flight schedule management

👥 Customer and booking oversight

📋 Real-time reporting tools

🌐 Live Deployment
We have a live deployment available!

🌍 Live Website: https://aero-flow-bookings.com

Demo Credentials (for live site only):

Traveler Account: demo@traveler.com / demo123

Admin Account: admin@aeroflow.com / admin123

Note: For local installation, authentication is disabled for easier testing.

🚀 Local Installation
Prerequisites
Requirement	Version	Installation Guide
Node.js	18.x or higher	Download Here
npm	9.x or higher	Comes with Node.js
Git	Latest	Download Here
Verify Installation:

bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
git --version     # Should show git version
Quick Setup (All Platforms)
Download the Project:

Download the ZIP from the submission

Extract to your Desktop (important for commands below)

Folder should be: Desktop/aeroflow/

Install and Run:

Follow platform-specific instructions below

⚙️ Platform-Specific Setup
macOS
Step 1: Open Terminal

bash
# Press Command + Space, type "Terminal", press Enter
Step 2: Run Setup Commands

bash
# Navigate to Desktop
cd ~/Desktop/aeroflow

# Install backend dependencies
cd backend
npm install

# Start backend (keep this terminal open)
npm start
Step 3: Open New Terminal Window

bash
# Press Command + N for new terminal window
cd ~/Desktop/aeroflow/frontend
npm install
npm run dev
Step 4: Access Application

Open browser and go to: http://localhost:3000

Backend runs at: http://localhost:5000

Windows
Option A: Command Prompt (Recommended)

cmd
:: Open Command Prompt as Administrator
:: Press Windows + R, type "cmd", press Ctrl + Shift + Enter

:: Navigate to Desktop
cd C:\Users\%USERNAME%\Desktop\aeroflow

:: Install backend
cd backend
npm install
npm start

:: Open NEW Command Prompt window
cd C:\Users\%USERNAME%\Desktop\aeroflow\frontend
npm install
npm run dev
Option B: PowerShell

powershell
# Open PowerShell as Administrator
# Press Windows + X, select "Windows PowerShell (Admin)"

Set-Location "C:\Users\$env:USERNAME\Desktop\aeroflow"
cd backend
npm install
npm start

# Open NEW PowerShell window
cd C:\Users\$env:USERNAME\Desktop\aeroflow\frontend
npm install
npm run dev
Option C: Git Bash

bash
# Open Git Bash
cd /c/Users/$USERNAME/Desktop/aeroflow/backend
npm install
npm start

# Open NEW Git Bash window
cd /c/Users/$USERNAME/Desktop/aeroflow/frontend
npm install
npm run dev
Linux (Ubuntu/Debian)
Step 1: Open Terminal

bash
# Press Ctrl + Alt + T
Step 2: Run Setup Commands

bash
# Navigate to Desktop
cd ~/Desktop/aeroflow

# Install backend
cd backend
npm install

# Start backend (keep terminal open)
npm start
Step 3: Open New Terminal

bash
# Press Ctrl + Shift + N for new terminal
cd ~/Desktop/aeroflow/frontend
npm install
npm run dev
✅ Verification Steps
You'll know it's working when you see:

Backend Terminal:

text
✅ Server running on port 5000
✅ Database connected successfully
✅ API endpoints ready
Frontend Terminal:

text
✅ Vite server running at http://localhost:3000
✅ Ready in XXXms
Browser:

Open http://localhost:3000

Should see Aeroflow homepage with navigation

🎯 Testing the Application
No login required for local demo! Just access features directly:

Test Traveler Flow:
Click "Search Flights"

Select: Toronto (YYZ) → Vancouver (YVR)

Choose a date

Select a flight

Pick a seat from the interactive map

Proceed to checkout (simulated payment)

Test Admin Features:
Click "Admin Dashboard" in navigation

View live analytics

Check flight trends

Test management options

🛠️ Troubleshooting
Problem	Solution
"npm: command not found"	Reinstall Node.js, restart terminal
Port 3000/5000 in use	Kill process: npx kill-port 3000 5000
"Cannot find module"	Delete node_modules and package-lock.json, run npm install
Slow installation	Clear cache: npm cache clean --force
Windows firewall blocking	Allow Node.js in Windows Defender Firewall
macOS permissions error	Run: sudo chown -R $(whoami) ~/.npm
Quick Fix Script (macOS/Linux):

bash
cd ~/Desktop/aeroflow
./scripts/fix-install.sh  # If provided
📁 Project Structure
text
Desktop/aeroflow/
├── 📁 backend/                 # Node.js/Express backend
│   ├── 📁 src/                # Source code
│   │   ├── 📁 controllers/    # Route controllers
│   │   ├── 📁 models/         # Database models
│   │   ├── 📁 routes/         # API routes
│   │   └── 📁 middleware/     # Custom middleware
│   ├── package.json           # Backend dependencies
│   ├── server.js             # Entry point
│   └── .env.example          # Environment template
├── 📁 frontend/               # React frontend
│   ├── 📁 src/               # React source
│   │   ├── 📁 components/    # Reusable components
│   │   ├── 📁 pages/         # Page components
│   │   ├── 📁 services/      # API services
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   └── .env.example         # Frontend env template
├── 📄 README.md              # This file
├── 📄 UserManual.pdf         # Detailed user guide
├── 📄 TeamBlog.xlsx          # Team contribution log
├── 📄 ProductBacklog.xlsx    # Project backlog
└── 📄 LICENSE               # MIT License
👥 Team
Name	Role	Student ID
Ayaan Kukreja	Product Owner	169069994
Kunal Gandhi	Technical Lead	169051546
Ashir Faisal	Backend Developer	169065288
Katelyn Tran	Frontend Developer	169067533
Swenson Hoang	UI/UX Designer	169039356
Shoradip Das	QA & Testing	169069720
Course: CP317A - Software Engineering
Instructor: [Instructor Name]
Term: Fall 2025

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

text
MIT License
Copyright (c) 2025 Team 21 - Aeroflow
🔗 Quick Links
🌍 Live Demo: https://aero-flow-bookings.com

📂 GitHub: [Insert Repository Link]

📧 Contact: [Team Email]

📊 Backlog: ProductBacklog.xlsx

📝 Blog: TeamBlog.xlsx

🚨 Important Notes
Local demo has authentication disabled for easier testing

Use the live site for full authentication experience

All data is simulated - no real payments processed

AI predictions are simulated for demo purposes

Database resets on each restart in local mode

Need Help?
If you encounter issues during setup:

Check the troubleshooting section above

Ensure both servers are running (two terminal windows)

Verify Node.js version: node --version

Clear browser cache if UI doesn't load properly

For additional support, contact:
📧 [Team Contact Email]
📱 [Team Contact Phone - Optional]

<div align="center">
Thank you for evaluating Aeroflow! 🎉

"Simplifying air travel, one flight at a time"

</div>
Last Updated: December 3, 2025
Version: 1.0.0

Demo Note
For evaluation purposes, authentication has been disabled. You can access all features immediately upon visiting http://localhost:3000.

Thank you for evaluating Aeroflow!
The system should now be running on your machine. If you have any setup issues, please refer to the troubleshooting guide or contact our team.
