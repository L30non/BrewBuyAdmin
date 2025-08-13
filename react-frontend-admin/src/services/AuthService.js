// src/services/AuthService.js
const API_BASE_URL = 'http://localhost:8080/api/auth';

class AuthService {
  async login(username, password) {
    try {
      console.log('Attempting login with:', { username, password });
      
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error response:', errorText);
        throw new Error(errorText || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response data:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      
      // Verify the token was stored
      const storedToken = localStorage.getItem('token');
      console.log('Stored token:', storedToken ? 'Present' : 'Missing');
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  getCurrentUser() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    console.log('Getting current user, token:', token ? 'Present' : 'Missing', ', username:', username ? 'Present' : 'Missing');
    
    if (token && username) {
      return { token, username };
    }
    return null;
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    console.log('Checking isAuthenticated, token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        console.log('Token expired, removing it');
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }
}

export default new AuthService();