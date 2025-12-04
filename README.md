Aeroflow – Flight Booking System
Live Website: https://aero-flow-bookings.com/
Team 21 | CP317A Group Project | Fall 2025

Quick Setup Guide

1. Install Node.js
   Download from: https://nodejs.org
   Choose version 18 or higher.
   To verify installation, open a terminal and run:
   node --version
   npm --version

2. Download and Extract Project
   Download the ZIP.
   Extract to Desktop so the folder path becomes Desktop/aeroflow/

------------------------------------------------------------
Important Note on Setup Differences
------------------------------------------------------------
Every computer environment is slightly different (OS versions, Node versions, directory permissions, terminal shells, etc.).
If you run into errors, you are encouraged to use an AI assistant (such as ChatGPT) to troubleshoot steps.
Copy and paste your error messages into the AI tool for personalized guidance. This often resolves setup issues quickly.

------------------------------------------------------------
Setup Instructions (macOS / Linux)
------------------------------------------------------------
Backend:
cd ~/Desktop/aeroflow/backend
npm install
npm start

Frontend (open a NEW terminal window):
cd ~/Desktop/aeroflow/frontend
npm install
npm run dev


------------------------------------------------------------
Setup Instructions (Windows PowerShell)
------------------------------------------------------------
Backend:
cd C:\Users\$env:USERNAME\Desktop\aeroflow\backend
npm install
npm start

Frontend (open a NEW PowerShell window):
cd C:\Users\$env:USERNAME\Desktop\aeroflow\frontend
npm install
npm run dev


------------------------------------------------------------
Setup Instructions (Windows Command Prompt)
------------------------------------------------------------
Backend:
cd C:\Users\%USERNAME%\Desktop\aeroflow\backend
npm install
npm start

Frontend (open a NEW Command Prompt window):
cd C:\Users\%USERNAME%\Desktop\aeroflow\frontend
npm install
npm run dev


------------------------------------------------------------
Access the Application
------------------------------------------------------------
Frontend: open browser and go to http://localhost:3000
Backend: runs on http://localhost:5000

Note: Initial load may take 1–2 minutes. If the page says "Cannot connect," wait and refresh.


------------------------------------------------------------
Live Website (No Installation Required)
------------------------------------------------------------
https://aero-flow-bookings.com/
The demo has no login requirement.


------------------------------------------------------------
Troubleshooting
------------------------------------------------------------
If you get "npm: command not found": reinstall Node.js

If a port is already in use:
npx kill-port 3000 5000

If installation errors occur:
Delete node_modules in both backend and frontend, then run npm install again.

If the frontend loads slowly:
Wait 1–2 minutes and refresh.

For all setup errors:
Use an AI assistant by pasting the exact error message. Environment-specific issues (permissions, PATH, shell differences) can be resolved much faster with interactive help.


------------------------------------------------------------
Quick Test
------------------------------------------------------------
1. Open http://localhost:3000
2. Click "Search Flights"
3. Choose Toronto to Vancouver
4. Select a flight and choose a seat
5. Complete the checkout process

Team 21 | CP317A | Fall 2025
