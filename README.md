Aeroflow – Flight Booking System ✈️
Live Website: 🌍 https://aero-flow-bookings.com/

Team 21 | CP317A Group Project | Fall 2025

📋 Quick Navigation
🌐 Live Website (Recommended)

🚀 Local Setup Instructions

🔧 Troubleshooting Guide

🤖 AI Assistance Prompt

📱 Testing the Application

🚀 Local Setup Instructions
Step 1: Install Prerequisites
1. Install Node.js (Required)

Download: https://nodejs.org/

Version: Choose 18.x or higher

Verify: After installation, open terminal/command prompt and run:

bash
node --version
npm --version
Both should show version numbers (e.g., v18.17.0, 9.6.7)

2. Download & Extract Project

Download the project ZIP file

Extract to Desktop (important for commands below)

Folder path should be: Desktop/aeroflow/

Step 2: Setup by Operating System
macOS / Linux Setup
📝 Follow these steps in order:

bash
# 1. Open Terminal
# 2. Install backend dependencies
cd ~/Desktop/aeroflow/backend
npm install

# 3. Start backend server (LEAVE THIS TERMINAL RUNNING)
npm start

# 4. OPEN NEW TERMINAL WINDOW/TAB
# 5. Install frontend dependencies
cd ~/Desktop/aeroflow/frontend
npm install

# 6. Start frontend server
npm run dev
Windows Setup
Choose your preferred terminal:

📝 Command Prompt (Recommended):

cmd
:: 1. Open Command Prompt
:: 2. Install backend
cd C:\Users\%USERNAME%\Desktop\aeroflow\backend
npm install
npm start

:: 3. OPEN NEW COMMAND PROMPT WINDOW
:: 4. Install frontend
cd C:\Users\%USERNAME%\Desktop\aeroflow\frontend
npm install
npm run dev
📝 PowerShell:

powershell
# 1. Open PowerShell
# 2. Install backend
cd C:\Users\$env:USERNAME\Desktop\aeroflow\backend
npm install
npm start

# 3. OPEN NEW POWERSHELL WINDOW
# 4. Install frontend
cd C:\Users\$env:USERNAME\Desktop\aeroflow\frontend
npm install
npm run dev
Step 3: Access the Application
✅ Expected Result:

Backend terminal: Shows Server running on port 5000

Frontend terminal: Shows Vite server running at http://localhost:3000

Open browser: Go to http://localhost:3000

⚠️ Important Note: If you see "Cannot connect" or the page seems stuck, wait 1-2 minutes then refresh. Initial startup can take time.

🌐 Live Deployment (Recommended for Testing)
No installation needed! Use our live website:

https://aero-flow-bookings.com/
Demo Credentials:

Traveler: demo@traveler.com / demo123

Admin: admin@aeroflow.com / admin123

Note: Local setup has no login required for easier testing.

🔧 Troubleshooting Guide
Quick Fix Checklist
✅ Node.js installed? Run node --version

✅ Project at Desktop/aeroflow? Check folder location

✅ Two terminals running? Need both backend AND frontend

✅ Waited 2 minutes? Initial load takes time

✅ Ports available? Try npx kill-port 3000 5000

Common Errors & Solutions
Error Message	What to Do
"npm: command not found"	Node.js not installed. Reinstall from nodejs.org
"Port 3000 already in use"	Run: npx kill-port 3000 5000 (installs if needed)
"Cannot find module"	Delete node_modules and run npm install again
"Failed to compile"	Check frontend terminal for specific error details
Blank page / "Loading..."	Wait 1-2 minutes, then refresh browser
Windows firewall blocking	Allow Node.js through Windows Defender Firewall
Permission denied (macOS/Linux)	Run: sudo chown -R $(whoami) ~/.npm
Verification Steps
If you're not sure if it's working:

Check backend terminal: Should show server running message

Check frontend terminal: Should show Vite server ready

Test backend directly: Open http://localhost:5000/api/health in browser

Clear browser cache: Sometimes helps with loading issues

🤖 AI Assistance Prompt
Each computer setup is different. If you're stuck, copy and paste this to any AI assistant:

text
I'm setting up a Node.js/React project called Aeroflow and need help.

Project structure:
- Extracted to Desktop/aeroflow/
- Backend folder: Node.js/Express (port 5000)
- Frontend folder: React/Vite (port 3000)

My system: [macOS/Windows/Linux - specify which]
Node.js version: [run: node --version and paste result]

I ran these commands:
cd Desktop/aeroflow/backend
npm install
npm start

Then in new terminal:
cd Desktop/aeroflow/frontend  
npm install
npm run dev

Current issue: [Describe exactly what happens, any error messages]

What specific commands should I run to fix this on my system?
📱 Testing the Application
Quick Test Flow (1 minute)
Open http://localhost:3000

Click "Search Flights"

Select Toronto → Vancouver, any date

Choose a flight from results

Pick a seat from the map

Apply code: WELCOME10

Complete checkout (simulated)

Admin Features Test
Click "Admin Dashboard" in navigation

View analytics and KPIs

Check flight management options

📁 Project Structure
text
Desktop/aeroflow/
├── backend/          # Node.js server
├── frontend/         # React app
├── README.md         # This file
├── UserManual.pdf    # Step-by-step guide
├── TeamBlog.xlsx     # Team contributions
└── ProductBacklog.xlsx
👥 Team Information
Role	Name	Student ID
Product Owner	Ayaan Kukreja	169069994
Technical Lead	Kunal Gandhi	169051546
Backend Developer	Ashir Faisal	169065288
Frontend Developer	Katelyn Tran	169067533
UI/UX Designer	Swenson Hoang	169039356
QA & Testing	Shoradip Das	169069720
Course: CP317A Software Engineering
Term: Fall 2025

🚨 Key Notes
✅ No login required for local setup

⏱️ Initial load takes 1-2 minutes - please be patient

🔄 Refresh browser if page seems stuck

💾 All data resets when you restart the servers

🌐 Use live site for quick testing without setup

❓ Still Having Issues?
Follow this sequence:

Wait 2 minutes, then refresh browser

Check both terminals are running without errors

Try the AI prompt above for personalized help

Test backend directly: http://localhost:5000/api/health

Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

Contact: Team 21 - CP317A Group Project

Thank you for evaluating Aeroflow! ✈️🎉

Last Updated: December 3, 2025
