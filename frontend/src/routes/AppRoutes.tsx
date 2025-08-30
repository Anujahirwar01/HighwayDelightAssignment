import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from '../screens/SignUp';
import SignIn from '../screens/SignIn';
import Dashboard from '../screens/Dashboard';


const AppRoutes: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
        </Routes>
    </Router>
);

export default AppRoutes;