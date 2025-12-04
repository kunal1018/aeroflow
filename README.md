Aeroflow – Flight Booking System
Live Website: https://aero-flow-bookings.com/
Team 21 | CP317A Group Project | Fall 2025

```
------------------------------------------------------------
Quick Setup Guide
------------------------------------------------------------

Install Node.js  
Recommended version 18 or higher

Option 1 – Standard installer  
Download from https://nodejs.org

Option 2 – Homebrew (macOS only)
brew update
brew install node

Verify installation
node --version
npm --version


Download and Extract Project  
Download the ZIP from the repository.  
Extract to Desktop so the folder path becomes Desktop/aeroflow/


------------------------------------------------------------
Important Note on Setup Differences
------------------------------------------------------------
Every computer environment is slightly different  
(OS version, Node version, terminal shell, permissions, etc.)

If you run into errors, you are encouraged to use an AI assistant  
such as ChatGPT to help troubleshoot.

Copy and paste your exact error message into the AI tool  
for personalized step by step guidance.


------------------------------------------------------------
Setup Instructions for macOS / Linux
------------------------------------------------------------

Backend
cd ~/Desktop/aeroflow/backend
npm install
npm start

Frontend (open a new terminal window)
cd ~/Desktop/aeroflow/frontend
npm install
npm run dev


------------------------------------------------------------
Setup Instructions for Windows PowerShell
------------------------------------------------------------

Backend
cd C:\Users\$env:USERNAME\Desktop\aeroflow\backend
npm install
npm start

Frontend (open a new PowerShell window)
cd C:\Users\$env:USERNAME\Desktop\aeroflow\frontend
npm install
npm run dev


------------------------------------------------------------
Setup Instructions for Windows Command Prompt
------------------------------------------------------------

Backend
cd C:\Users\%USERNAME%\Desktop\aeroflow\backend
npm install
npm start

Frontend (open a new Command Prompt window)
cd C:\Users\%USERNAME%\Desktop\aeroflow\frontend
npm install
npm run dev


------------------------------------------------------------
Accessing the Application
------------------------------------------------------------

Frontend runs at  
http://localhost:3000  

Backend runs at  
http://localhost:5000  

Initial load may take 1–2 minutes.  
If you see "Cannot connect," wait and refresh.


------------------------------------------------------------
Live Website (No Installation Required)
------------------------------------------------------------

https://aero-flow-bookings.com/

Demo version has no login requirement.


------------------------------------------------------------
Troubleshooting
------------------------------------------------------------

If you get "npm: command not found"  
Reinstall Node.js or install through Homebrew on macOS.

If a port is already in use  
npx kill-port 3000 5000

If installation errors occur  
Delete node_modules in both backend and frontend  
Then run npm install again.

If the frontend loads slowly  
Wait 1–2 minutes and refresh the browser.

For all environment-specific setup errors  
Use an AI assistant and paste the full error message.  
Most issues (PATH, shell, permissions) can be resolved quickly  
with contextual guidance.


------------------------------------------------------------
Quick Test
------------------------------------------------------------

1. Open http://localhost:3000  
2. Click Search Flights  
3. Select Toronto → Vancouver  
4. Choose a flight and seat  
5. Complete checkout  


Team 21 | CP317A | Fall 2025
```
