Aeroflow – Flight Booking System
Project Overview
Aeroflow is an intelligent flight booking system built for travelers and airline administrators. It features real-time flight search, seat selection, secure payments, discount codes, and an admin dashboard with analytics and AI-powered delay predictions.

Team 21: Ayaan Kukreja, Kunal Gandhi, Ashir Faisal, Katelyn Tran, Swenson Hoang, Shoradip Das
GitHub Repository: [Insert your GitHub repo link here]
Live Demo: [Insert live demo link if applicable]

Quick Start Guide
Prerequisites
Node.js 18+ installed on your system

Git installed (for cloning)

Step 1: Install Node.js (If Not Already Installed)
macOS:

bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
Windows:

Download installer from nodejs.org

Run the installer (check "Add to PATH" during installation)

Restart your terminal

Linux (Ubuntu/Debian):

bash
sudo apt update
sudo apt install nodejs npm
Verify installation (all platforms):

bash
node --version
npm --version
You should see version numbers (e.g., v18.17.0, 9.6.7).

Step 2: Download and Extract Project
Download the project ZIP file from the submission

Extract it to your Desktop

The extracted folder should be named aeroflow

Your Desktop should now have:

text
Desktop/
└── aeroflow/
    ├── backend/
    ├── frontend/
    ├── README.md
    └── ...
Step 3: Launch Aeroflow - Platform-Specific Commands
For macOS/Linux Users:
Open Terminal and run these commands exactly:

bash
# Navigate to Desktop
cd ~/Desktop/aeroflow

# Install backend dependencies
cd backend
npm install

# Start backend server (in a NEW terminal window/tab)
npm start

# Now open a NEW terminal window/tab
cd ~/Desktop/aeroflow/frontend
npm install
npm run dev
For Windows Users:
Open Command Prompt or PowerShell as Administrator and run:

cmd
# Navigate to Desktop
cd C:\Users\%USERNAME%\Desktop\aeroflow

# Install backend dependencies
cd backend
npm install

# Start backend server (in a NEW Command Prompt window)
npm start

# Now open a NEW Command Prompt window
cd C:\Users\%USERNAME%\Desktop\aeroflow\frontend
npm install
npm run dev
Alternative for Windows (Git Bash or WSL):

bash
# Navigate to Desktop
cd /c/Users/%USERNAME%/Desktop/aeroflow

# Install backend dependencies
cd backend
npm install

# Start backend server (in a NEW terminal)
npm start

# Now open a NEW terminal
cd /c/Users/%USERNAME%/Desktop/aeroflow/frontend
npm install
npm run dev
Step 4: Access the Application
Once both servers are running:

Backend will be at: http://localhost:5000

Frontend will be at: http://localhost:3000

Open your browser and go to: http://localhost:3000

Note: For demo purposes, no login is required. You can immediately access all features.

Expected Output
When you run the commands correctly, you should see:

Backend Terminal:

text
Server running on port 5000
Database connected successfully
Frontend Terminal:

text
Vite server running at http://localhost:3000
✓ ready in Xms
Browser: Aeroflow homepage with navigation options.

Troubleshooting
Common Issues:
"npm: command not found"

Node.js isn't installed or not in PATH

Fix: Reinstall Node.js and restart terminal

"Port 3000/5000 already in use"

Fix for macOS/Linux:

bash
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:5000 | xargs kill -9
Fix for Windows:

cmd
netstat -ano | findstr :3000
taskkill /PID [PID] /F
"Error: Cannot find module"

Fix: Delete node_modules and reinstall:

bash
rm -rf node_modules package-lock.json
npm install
Slow npm install

Fix: Clear npm cache:

bash
npm cache clean --force
Testing the System
Once Aeroflow is running, test these features:

Traveler Features:
Click "Search Flights"

Select origin/destination/date

Choose a flight

Select a seat from the interactive map

Proceed to checkout (no payment required for demo)

Admin Features:
Click "Admin Dashboard" in navigation

View KPIs and analytics

Test flight management options

Project Structure
text
aeroflow/
├── backend/          # Node.js/Express server
│   ├── src/
│   ├── package.json
│   └── server.js
├── frontend/         # React application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── UserManual.pdf    # Detailed feature guide
├── TeamBlog.xlsx     # Team contribution log
└── README.md         # This file
Quick Reference Commands
All-in-One Launch Script (macOS/Linux)
Save this as launch.sh in the aeroflow folder:

bash
#!/bin/bash
cd ~/Desktop/aeroflow/backend
npm install
npm start &
cd ../frontend
npm install
npm run dev
Make it executable and run:

bash
chmod +x launch.sh
./launch.sh
Windows Batch File
Save this as launch.bat in the aeroflow folder:

batch
@echo off
cd C:\Users\%USERNAME%\Desktop\aeroflow\backend
call npm install
start "Backend" npm start
cd ..\frontend
call npm install
start "Frontend" npm run dev
Need Help?
If you encounter issues:

Check the Troubleshooting section above

Ensure both servers are running (two terminal windows)

Verify you're in the correct directory

Clear browser cache if UI doesn't load properly

Contact: Team 21 – CP317A Group Project

Demo Note
For evaluation purposes, authentication has been disabled. You can access all features immediately upon visiting http://localhost:3000.

Thank you for evaluating Aeroflow!
The system should now be running on your machine. If you have any setup issues, please refer to the troubleshooting guide or contact our team.
