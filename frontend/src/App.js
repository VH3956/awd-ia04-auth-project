import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';

import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';

// MUI components for basic layout
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function App() {

  return (
    // 'Container' and 'Box' from MUI help center our content
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* This is where the routes are defined */}
        <Routes>
          {/* 2. --- UPDATE ROUTE STRUCTURE --- */}
          
          {/* Route 1: Public (everyone can see) */}
          <Route path="/" element={<HomePage />} />

          {/* Route 2: Public-Only (only non-logged-in users can see) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Route>

          {/* Route 3: Protected (only logged-in users can see) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

        </Routes>
      </Box>
    </Container>
  );
}

export default App;