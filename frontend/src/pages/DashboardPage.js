import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../api/api'; // Import our new axios instance
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// This is the function React Query will call
const fetchUserMe = async () => {
  // We use our 'api' instance, which has the interceptors
  const { data } = await api.get('/user/me');
  return data;
};

export default function DashboardPage() {
  const { logout } = useAuth();
  
  // Use useQuery to fetch data from the protected endpoint
  const { data: user, error, isLoading } = useQuery({
    queryKey: ['userMe'], // A key for this query
    queryFn: fetchUserMe, // The function to run
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Redirect to login after logout
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <Typography component="h1" variant="h5">
        Dashboard
      </Typography>

      {isLoading && <CircularProgress />}
      
      {error && (
        <Alert severity="error">Failed to load user data. Please try logging in again.</Alert>
      )}

      {user && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Welcome, {user.email}!</Typography>
          <Typography variant="body2">
            You registered on: {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      )}

      <Button variant="contained" color="error" onClick={handleLogout} fullWidth>
        Log Out
      </Button>
    </Box>
  );
}