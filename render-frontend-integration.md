# Frontend Integration Guide for Render

This guide will help you update your frontend application to work with your backend API deployed on Render.

## Updating API Base URL

You need to update your frontend to use the Render-deployed backend URL instead of the local development URL.

### Step 1: Locate API Configuration

First, locate where your API base URL is defined in your frontend project. Common locations include:

- `src/api/index.js`
- `src/config.js` or `src/config/index.js`
- `src/services/api.js`
- `src/utils/api.js`
- `.env` or `.env.production` files

### Step 2: Update the API Base URL

Replace the existing API base URL with your Render deployment URL:

```javascript
// Before
const API_URL = 'http://localhost:4000/api';

// After
const API_URL = 'https://khidki-backend.onrender.com/api';
```

If you're using environment variables:

```
# .env.production
VITE_API_URL=https://khidki-backend.onrender.com/api
```

### Step 3: Handle CORS in API Requests

Ensure your API requests include credentials for cookies/sessions:

```javascript
// Example with fetch
fetch('https://khidki-backend.onrender.com/api/user/profile', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include' // Important for cookies/sessions
})

// Example with axios
axios.get('https://khidki-backend.onrender.com/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  withCredentials: true // Important for cookies/sessions
})
```

### Step 4: Update Global Axios Configuration (if used)

If you're using Axios throughout your application:

```javascript
import axios from 'axios';

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: 'https://khidki-backend.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

## Handling Authentication

### JWT Token Storage

If your backend uses JWT for authentication:

1. Store the token securely after login:

```javascript
// After successful login
const handleLogin = async (email, password) => {
  try {
    const response = await axios.post('https://khidki-backend.onrender.com/api/user/login', {
      email,
      password
    });
    
    const { token } = response.data;
    
    // Store token in localStorage or sessionStorage
    localStorage.setItem('token', token);
    
    // Redirect to dashboard or home page
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    setError('Invalid email or password');
  }
};
```

2. Include the token in all authenticated requests:

```javascript
const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get('https://khidki-backend.onrender.com/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    setUserProfile(response.data);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};
```

### Session-Based Authentication

If your backend uses session-based authentication:

1. Ensure your requests include credentials:

```javascript
axios.defaults.withCredentials = true;
```

2. Handle CORS properly (already configured in the backend)

## Testing the Integration

After updating your frontend configuration:

1. Build your frontend application:

```bash
cd /path/to/your/frontend
npm run build
```

2. Deploy your frontend to your preferred hosting platform (Render, Netlify, Vercel, etc.)

3. Test the integration by:
   - Logging in
   - Viewing products
   - Adding items to cart
   - Placing orders

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Check the browser console for specific error messages
2. Verify that your backend's CORS configuration includes your frontend domain
3. Ensure your requests include the proper credentials

### Authentication Issues

If authentication is not working:

1. Check that your token is being stored correctly
2. Verify that the token is being included in request headers
3. Check that your backend is validating the token correctly

### API Connection Issues

If your frontend can't connect to the backend:

1. Verify that your API base URL is correct
2. Check that your backend is deployed and running
3. Test the API endpoints using tools like Postman or curl

## Example: Updating a React Frontend

Here's an example of updating a React frontend to use the Render-deployed backend:

1. Create or update an API service file:

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'https://khidki-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User API
export const loginUser = (email, password) => 
  api.post('/user/login', { email, password });

export const registerUser = (userData) => 
  api.post('/user/register', userData);

export const getUserProfile = () => 
  api.get('/user/profile');

// Product API
export const getAllProducts = () => 
  api.get('/product');

export const getProductById = (id) => 
  api.get(`/product/${id}`);

// Cart API
export const getCart = () => 
  api.get('/cart');

export const addToCart = (productId, quantity) => 
  api.post('/cart', { productId, quantity });

// Order API
export const createOrder = (orderData) => 
  api.post('/order', orderData);

export const getUserOrders = () => 
  api.get('/order');

export default api;
```

2. Use this API service in your components:

```javascript
// src/components/Login.jsx
import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
