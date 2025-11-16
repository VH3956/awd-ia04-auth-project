import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useMutation, useQueryClient } from '@tanstack/react-query'; // 2. Import useMutation
import { useAuth } from '../context/AuthContext'; // 3. Import useAuth
import api from '../api/api'; // 4. Import our axios instance
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';

// This is the function React Query will call
const loginUser = async ({ email, password }) => {
  // We use our 'api' instance
  const { data } = await api.post('/user/login', { email, password });
  return data; // This will be { accessToken, refreshToken }
};

export default function LoginPage() {
  const navigate = useNavigate(); // For redirecting
  const { login } = useAuth(); // Get the login function from context
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 5. Set up the React Query mutation
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.clear(); // Clear any stale data

      // 6. On success, call our context login function
      login(data.accessToken, data.refreshToken);
      // 7. Redirect to the dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      // Error is handled by the mutation state
      console.error("Login failed:", error);
    },
  });

  // 8. The real submit handler
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <IconButton component={RouterLink} to="/" aria-label="home">
          <HomeIcon />
        </IconButton>
      </Box>

      <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
        Sign In
      </Typography>

      {/* 9. Show a real error message from the mutation */}
      {mutation.isError && (
        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
          {mutation.error.response?.data?.message || "Login failed. Check email or password."}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          {...register('password', {
            required: 'Password is required',
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={mutation.isPending} // Disable button while logging in
        >
          {mutation.isPending ? 'Signing In...' : 'Sign In'}
        </Button>
        <Link component={RouterLink} to="/sign-up" variant="body2">
          {"Don't have an account? Sign Up"}
        </Link>
      </Box>
    </>
  );
}