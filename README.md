Aeroflow – Flight Booking System ✈️
Live Website: 🌍 https://aero-flow-bookings.com/

Team 21 | CP317A Group Project | Fall 2025

🚀 Quick Start (Local Setup)
1. Install Node.js
Download from: https://nodejs.org/

Choose: Version 18 or higher

Verify installation: Open terminal and run:

bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
2. Download & Extract Project
Download the project ZIP file

Extract it to your Desktop

You should have: Desktop/aeroflow/

💻 Platform-Specific Instructions
macOS / Linux Instructions:
bash
# 1. Open Terminal
# 2. Navigate to backend folder
cd ~/Desktop/aeroflow/backend

# 3. Install backend dependencies
npm install

# 4. Start backend server (KEEP THIS TERMINAL OPEN)
npm start

# 5. OPEN NEW TERMINAL WINDOW (Command + N)
# 6. Navigate to frontend folder
cd ~/Desktop/aeroflow/frontend

# 7. Install frontend dependencies
npm install

# 8. Start frontend server
npm run dev
Windows Instructions:
Option A: Command Prompt (Recommended)
cmd
:: 1. Open Command Prompt
:: 2. Navigate to backend folder
cd C:\Users\%USERNAME%\Desktop\aeroflow\backend

:: 3. Install backend dependencies
npm install

:: 4. Start backend server (KEEP THIS WINDOW OPEN)
npm start

:: 5. OPEN NEW COMMAND PROMPT WINDOW
:: 6. Navigate to frontend folder
cd C:\Users\%USERNAME%\Desktop\aeroflow\frontend

:: 7. Install frontend dependencies
npm install

:: 8. Start frontend server
npm run dev
Option B: PowerShell
powershell
# 1. Open PowerShell
# 2. Navigate to backend folder
cd C:\Users\$env:USERNAME\Desktop\aeroflow\backend

# 3. Install backend dependencies
npm install

# 4. Start backend server (KEEP THIS WINDOW OPEN)
npm start

# 5. OPEN NEW POWERSHELL WINDOW
# 6. Navigate to frontend folder
cd C:\Users\$env:USERNAME\Desktop\aeroflow\frontend

# 7. Install frontend dependencies
npm install

# 8. Start frontend server
npm run dev
✅ Access the Application
Once both servers are running:

Frontend: Open browser to http://localhost:3000

Backend: Running at http://localhost:5000

⚠️ IMPORTANT: When you first open localhost:3000, you may see a "Cannot connect" or "Loading..." message. This is normal! It typically takes 1-2 minutes for everything to fully initialize. Please wait and refresh the page after 2 minutes.

✅ Done! The system is now running locally.

🌐 Live Deployment (Recommended for Testing)
Use our live website for immediate testing without installation:

https://aero-flow-bookings.com/
Live Site Demo Credentials:

Traveler Account: demo@traveler.com / demo123

Admin Account: admin@aeroflow.com / admin123

Note: Local installation has no login required for easier testing.

🔧 Troubleshooting & AI Assistance
Common Issues & Solutions:
Problem	Solution
"npm: command not found"	Reinstall Node.js from nodejs.org
Port 3000/5000 already in use	Run: npx kill-port 3000 5000
"Cannot connect" error on localhost	Wait 2 minutes then refresh the page
Slow initial loading	Normal - backend services need time to start
Installation errors	Delete node_modules folder and run npm install again
Windows firewall blocking	Allow Node.js in Windows Defender Firewall
macOS permissions error	Run: sudo chown -R $(whoami) ~/.npm
🤖 Need AI Help with Setup?
Each computer setup can be different. If you're having trouble, copy and paste this prompt into ChatGPT, Claude, or any AI assistant:

text
I need help setting up a Node.js/React application called Aeroflow. Here's my situation:

- I downloaded a ZIP file and extracted it to my Desktop as "aeroflow"
- The project has a backend folder (Node.js/Express) and frontend folder (React)
- I've installed Node.js version [your version here]
- When I run the setup, I'm getting this specific error: [describe your exact error]

I've tried running these commands:
cd ~/Desktop/aeroflow/backend
npm install
npm start

Then in a new terminal:
cd ~/Desktop/aeroflow/frontend
npm install
npm run dev

The frontend is supposed to run on http://localhost:3000 and backend on http://localhost:5000.

What specific commands should I run to fix my issue on my [macOS/Windows/Linux] system?
Why this helps: This gives the AI all the context it needs to provide specific, actionable help for your exact system.

📱 Testing Features
Traveler Flow (Test this first):
Click "Search Flights"

Select: Toronto (YYZ) → Vancouver (YVR)

Choose any date

Select a flight from results

Pick seat from interactive map

Apply discount code: WELCOME10

Complete checkout (simulated payment)

Admin Features:
Click "Admin Dashboard" in navigation

View live analytics and KPIs

Check flight trends

Manage flight schedules

📁 Project Structure
text
Desktop/aeroflow/
├── backend/          # Node.js server (port 5000)
├── frontend/         # React app (port 3000)
├── README.md         # This file
├── UserManual.pdf    # Detailed feature guide
├── TeamBlog.xlsx     # Team contribution log
└── ProductBacklog.xlsx
👥 Team
Ayaan Kukreja (Product Owner) - 169069994

Kunal Gandhi (Technical Lead) - 169051546

Ashir Faisal (Backend Developer) - 169065288

Katelyn Tran (Frontend Developer) - 169067533

Swenson Hoang (UI/UX Designer) - 169039356

Shoradip Das (QA & Testing) - 169069720

Course: CP317A Software Engineering
Term: Fall 2025

🚨 Important Notes
✅ Local demo: No login required (just open localhost:3000)

✅ Live site: Full authentication with demo credentials above

✅ Initial loading may take 1-2 minutes - this is normal

✅ All data is simulated for demo purposes

✅ Database resets on local server restart

✅ Two terminal windows required (one for backend, one for frontend)

❓ Need Help?
First, be patient - initial load can take 1-2 minutes

Check the Troubleshooting section above

Ensure both servers are running (two terminal windows)

Use the AI assistance prompt if you're stuck

Verify Node.js version: node --version

Clear browser cache if UI doesn't load properly

Contact: Team 21 - CP317A Group Project
