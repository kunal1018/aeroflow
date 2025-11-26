import Layout from "./Layout.jsx";

import Home from "./Home";

import SearchResults from "./SearchResults";

import SeatSelection from "./SeatSelection";

import PassengerInfo from "./PassengerInfo";

import Payment from "./Payment";

import BookingConfirmation from "./BookingConfirmation";

import MyBookings from "./MyBookings";

import FlightStatus from "./FlightStatus";

import AdminDashboard from "./AdminDashboard";

import AdminFlights from "./AdminFlights";

import AdminBookings from "./AdminBookings";

import InFlightServices from "./InFlightServices";

import LiveFlightBoard from "./LiveFlightBoard";

import BaggageSelection from "./BaggageSelection";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    SearchResults: SearchResults,
    
    SeatSelection: SeatSelection,
    
    PassengerInfo: PassengerInfo,
    
    Payment: Payment,
    
    BookingConfirmation: BookingConfirmation,
    
    MyBookings: MyBookings,
    
    FlightStatus: FlightStatus,
    
    AdminDashboard: AdminDashboard,
    
    AdminFlights: AdminFlights,
    
    AdminBookings: AdminBookings,
    
    InFlightServices: InFlightServices,
    
    LiveFlightBoard: LiveFlightBoard,
    
    BaggageSelection: BaggageSelection,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/SearchResults" element={<SearchResults />} />
                
                <Route path="/SeatSelection" element={<SeatSelection />} />
                
                <Route path="/PassengerInfo" element={<PassengerInfo />} />
                
                <Route path="/Payment" element={<Payment />} />
                
                <Route path="/BookingConfirmation" element={<BookingConfirmation />} />
                
                <Route path="/MyBookings" element={<MyBookings />} />
                
                <Route path="/FlightStatus" element={<FlightStatus />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/AdminFlights" element={<AdminFlights />} />
                
                <Route path="/AdminBookings" element={<AdminBookings />} />
                
                <Route path="/InFlightServices" element={<InFlightServices />} />
                
                <Route path="/LiveFlightBoard" element={<LiveFlightBoard />} />
                
                <Route path="/BaggageSelection" element={<BaggageSelection />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}