import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Customer from './pages/Customer';
import Staff from './pages/Staff';
import RoomManagement from './pages/Rooms';
import Login from './components/Login';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Check if user is logged in on initial render
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      {isLoggedIn ? (
        // Render app content if logged in
        <div className="grid-container">
          <Header OpenSidebar={OpenSidebar} />
          <Sidebar
            openSidebarToggle={openSidebarToggle}
            OpenSidebar={OpenSidebar}
            handleLogout={handleLogout} // Pass logout function to Sidebar
          />
          <main className="main-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/rooms" element={<RoomManagement />} />
              <Route path="/staff" element={<Staff />} />
            </Routes>
          </main>
        </div>
      ) : (
        // Render login screen if not logged in
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </Router>
  );
}

export default App;
