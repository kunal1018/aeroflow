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

3. Run the Application
For macOS/Linux:
bash
# Open Terminal
# Navigate to project
cd ~/Desktop/aeroflow/backend

# Install dependencies
npm install

# Start backend (keep this terminal open)
npm start

# Open NEW terminal window
cd ~/Desktop/aeroflow/frontend
npm install
npm run dev
For Windows:
cmd
:: Open Command Prompt
:: Navigate to project
cd C:\Users\%USERNAME%\Desktop\aeroflow\backend

:: Install dependencies
npm install

:: Start backend (keep this window open)
npm start

:: Open NEW Command Prompt window
cd C:\Users\%USERNAME%\Desktop\aeroflow\frontend
npm install
npm run dev
4. Access the Application
Frontend: Open browser to http://localhost:3000

Backend: Running at http://localhost:5000

✅ Done! The system is now running locally.

🌐 Live Deployment
Use our live website for immediate testing:

https://aero-flow-bookings.com/
Live Site Credentials:

Traveler: demo@traveler.com / demo123

Admin: admin@aeroflow.com / admin123

Note: Local installation has no login required for easier testing.

🔧 Troubleshooting
Common Issues:
"npm: command not found" → Reinstall Node.js

Port already in use → Run: npx kill-port 3000 5000

Installation errors → Delete node_modules and run npm install again

Slow installation → Run: npm cache clean --force

Verify it's working:
Backend terminal shows: Server running on port 5000

Frontend terminal shows: Vite server running at http://localhost:3000

Browser loads Aeroflow homepage

📱 Testing Features
Traveler Features:
Search flights (try Toronto → Vancouver)

Select a flight

Choose seat from interactive map

Apply discount code "WELCOME10"

Complete checkout (simulated payment)

Admin Features:
Click "Admin Dashboard"

View analytics and KPIs

Check flight trends

Manage flight schedules

📁 Project Structure
text
aeroflow/
├── backend/     # Node.js server
├── frontend/    # React application
├── README.md    # This file
└── UserManual.pdf
👥 Team Contact
Ayaan Kukreja (Product Owner)

Kunal Gandhi (Technical Lead)

Ashir Faisal, Katelyn Tran, Swenson Hoang, Shoradip Das

Course: CP317A Software Engineering
Instructor: [Instructor Name]
Term: Fall 2025

🚨 Important Notes
✅ Local demo: No login required

✅ Live site: Full authentication experience

✅ All data simulated for demo purposes

✅ Database resets on local restart

Need Help?
Check troubleshooting section above

Ensure both servers are running

Clear browser cache if needed

Contact: Team 21 - CP317A Group Project

Thank you for evaluating Aeroflow! 🎉

Last Updated: December 3, 2025

