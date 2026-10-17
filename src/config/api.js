// src/config/api.js
// Centralized API configuration for production and development

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
export const API_UPLOAD_URL = `${API_BASE_URL}/upload`
