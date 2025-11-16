import React, { useState } from 'react'; // Import useState
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert'; // Import Alert
import IconButton from '@mui/material/IconButton'; // Import IconButton
import HomeIcon from '@mui/icons-material/Home'; // Import HomeIcon

// API Call Function (no change)
const registerUser = async ({ email, password }) => {
  const { data } = await axios.post(
    'http://localhost:8080/user/register',
    { email, password }
  );
  return data;
};

export default function SignUpPage() {
  // --- NEW: State for messages ---
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // --- React Query Mutation ---
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      setSuccessMessage("Registration successful! You can now log in."); // Set state
      setErrorMessage(""); // Clear old errors
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      console.error("Registration error:", error);
      setErrorMessage(message); // Set state
      setSuccessMessage(""); // Clear old success
    },
  });

  // --- Submit Handler ---
  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      {/* --- NEW: Home Button --- */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <IconButton component={RouterLink} to="/" aria-label="home">
          <HomeIcon />
        </IconButton>
      </Box>

      <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
        Sign Up
      </Typography>

      {/* --- NEW: Success and Error Messages --- */}
      {successMessage && (
        <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
          {errorMessage}
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
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Signing Up...' : 'Sign Up'}
        </Button>
        <Link component={RouterLink} to="/login" variant="body2">
          {"Already have an account? Sign In"}
        </Link>
      </Box>
    </>
  );
}