import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api, { setupInterceptors } from '../api/api';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(() =>
    window.localStorage.getItem('refreshToken')
  );
  // This state is crucial to prevent child components (like Dashboard)
  // from loading before we've attempted our silent refresh.
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const updateAccessToken = (newAccessToken) => {
    setAccessToken(newAccessToken);
  };

  const login = (newAccessToken, newRefreshToken) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    window.localStorage.setItem('refreshToken', newRefreshToken);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    window.localStorage.removeItem('refreshToken');
    
    queryClient.clear(); // Clear React Query cache on logout
  };

  // --- This is the new logic ---

  // 1. Setup interceptors
  // We use useMemo to ensure this runs only once
  useMemo(() => {
    // We pass the functions the interceptor will need.
    // This avoids circular dependencies.
    setupInterceptors({
      getAccessToken: () => accessToken,
      getRefreshToken: () => refreshToken,
      updateAccessToken: updateAccessToken,
      logout: logout,
    });
  }, [accessToken, refreshToken]); // Re-run if tokens change (though it shouldn't)

  // 2. Silent Refresh on App Load
  useEffect(() => {
    const attemptSilentRefresh = async () => {
      // If we have no refresh token, we're done.
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Use a *plain* axios call, not the interceptor,
        // to avoid a loop.
        const baseURL = api.defaults.baseURL;
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken); // Set the new token
        
      } catch (error) {
        // If refresh fails, the token is bad. Log the user out.
        console.log("Silent refresh failed", error);
        logout();
      } finally {
        // In any case, we are done loading.
        setIsLoading(false);
      }
    };

    attemptSilentRefresh();
  }, []); // Empty array means this runs ONCE on app load

  // --- End of new logic ---

  const authValue = {
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    login,
    logout,
    updateAccessToken,
  };
  
  // Don't render the app until the silent refresh is complete
  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook (no change)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};