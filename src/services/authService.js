import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      if (response.data.refreshToken) localStorage.setItem('refreshToken', response.data.refreshToken);
      const { accessToken, refreshToken, ...userData } = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  verify: async (token) => {
    const response = await api.get('/auth/verify', { params: { token } });
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      if (response.data.refreshToken) localStorage.setItem('refreshToken', response.data.refreshToken);
      const { accessToken, refreshToken, ...userData } = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
