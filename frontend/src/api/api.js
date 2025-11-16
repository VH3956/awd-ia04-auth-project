import axios from 'axios';

// Create a new axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080'
});

// We no longer set up interceptors here.
// Instead, we export a function that AuthContext will call.

export const setupInterceptors = (authFunctions) => {
  
  // Request Interceptor
  api.interceptors.request.use(
    (config) => {
      // Get the token using the function from context
      const token = authFunctions.getAccessToken(); 
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Get the refresh token using the function from context
          const refreshToken = authFunctions.getRefreshToken();

          const baseURL = api.defaults.baseURL;
          
          const response = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken: refreshToken,
          });

          const newAccessToken = response.data.accessToken;

          // Update the context using the function
          authFunctions.updateAccessToken(newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          // Use the logout function from context
          authFunctions.logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;