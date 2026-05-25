import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const startupService = {
  getAll: () => api.get('/startups'),
  getById: (id) => api.get(`/startups/${id}`),
  getMyStartups: () => api.get('/startups/me'),
  create: (data) => api.post('/startups', data),
  update: (id, data) => api.put(`/startups/${id}`, data),
  delete: (id) => api.delete(`/startups/${id}`),
};

export const vacancyService = {
  getAll: () => api.get('/vacancies'),
  getById: (id) => api.get(`/vacancies/${id}`),
  getByStartupId: (startupId) => api.get(`/startups/${startupId}/vacancies`),
  create: (data) => api.post('/vacancies', data),
  update: (id, data) => api.put(`/vacancies/${id}`, data),
  apply: (vacancyId) => api.post(`/vacancies/${vacancyId}/applications`),
  getApplications: (vacancyId) => api.get(`/vacancies/${vacancyId}/applications`),
  cancelApplication: (vacancyId) => api.patch(`/vacancies/${vacancyId}/applications/cancel`),
  getMyApplications: () => api.get('/vacancies/my-applications'),
  updateApplicationStatus: (applicationId, status) => api.patch(`/vacancies/applications/${applicationId}/status?status=${status}`),
};

export const profileService = {
  getMe: () => api.get('/profile/me'),
  updateMe: (data) => api.patch('/profile/me', data),
  getById: (id) => api.get(`/profile/${id}`),
};

export const fileService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyCv: () => api.get('/files/my-cv'),
  delete: (publicId) => api.delete('/files/delete', { params: { publicId } }),
  previewCv: () => api.get('/files/preview-cv', { responseType: 'blob' }),
  getUserCv: (userId) => api.get(`/files/user/${userId}/cv`),
};

export default api;
