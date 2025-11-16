import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth

export default function HomePage() {
  const { isAuthenticated } = useAuth(); // 2. Get the authentication state

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%', // Ensure it fills the container
      }}
    >
      <Typography component="h1" variant="h5">
        IA03 User Registration
      </Typography>
      <Typography>
        Welcome!
      </Typography>
      
      {/* 3. --- CONDITIONAL BUTTONS --- */}
      {isAuthenticated ? (
        // If logged in, show "Go to Dashboard"
        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          fullWidth
        >
          Go to Dashboard
        </Button>
      ) : (
        // If logged out, show Login and Sign Up
        <>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            fullWidth
          >
            Login
          </Button>
          <Button
            component={RouterLink}
            to="/sign-up"
            variant="outlined"
            fullWidth
          >
            Sign Up
          </Button>
        </>
      )}
    </Box>
  );
}