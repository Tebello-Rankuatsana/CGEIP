import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const instituteService = {
  getAll: () => api.get('/institutes'),
  create: (data) => api.post('/institutes', data),
  update: (id, data) => api.put(`/institutes/${id}`, data),
  delete: (id) => api.delete(`/institutes/${id}`),
};

export const courseService = {
  getAll: () => api.get('/courses'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const applicationService = {
  apply: (data) => api.post('/applications', data),
  getStudentApplications: () => api.get('/applications/student'),
  getInstituteApplications: (instituteId) => api.get(`/applications/institute/${instituteId}`),
  updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};

export const jobService = {
  getAll: () => api.get('/jobs'),
  create: (data) => api.post('/jobs', data),
  apply: (jobId) => api.post(`/jobs/${jobId}/apply`),
  getApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
};

export const studentService = {
  updateProfile: (data) => api.put('/students/profile', data),
  uploadTranscript: (file) => {
    const formData = new FormData();
    formData.append('transcript', file);
    return api.post('/students/transcript', formData);
  }
};