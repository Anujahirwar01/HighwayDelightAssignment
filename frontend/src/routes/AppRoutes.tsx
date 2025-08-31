import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from '../screens/SignUp';
import SignIn from '../screens/SignIn';
import Dashboard from '../screens/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Notes from '../screens/Notes';
import NoteView from '../screens/NoteView';
import NoteEdit from '../screens/NoteEdit';

const AppRoutes: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
                path="/signup" 
                element={
                    <PublicRoute>
                        <SignUp />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/signin" 
                element={
                    <PublicRoute>
                        <SignIn />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/notes" 
                element={
                    <ProtectedRoute>
                        <Notes />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/note/:id" 
                element={
                    <ProtectedRoute>
                        <NoteView />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/note/:id/edit" 
                element={
                    <ProtectedRoute>
                        <NoteEdit />
                    </ProtectedRoute>
                } 
            />

        </Routes>
    </Router>
);

export default AppRoutes;