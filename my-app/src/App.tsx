import './App.css';
import React, { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Register from './pages/RegisterPage/Register';
import Login from './pages/LoginPage/Login';
import Tasks from './pages/TasksPage/Tasks';
import { AuthProvider } from './components/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';



const App = () => {


  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
