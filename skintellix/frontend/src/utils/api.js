import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('skintellix_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res.data,
  err => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── Products ──────────────────────────────────────────────────────
export const productsApi = {
  list: (params = {}) => api.get('/products', { params }),
  featured: () => api.get('/products/featured'),
  detail: (id) => api.get(`/products/${id}`),
  search: (q) => api.get('/products', { params: { search: q } }),
  suggestions: (q) => api.get('/products/search/suggestions', { params: { q } }),
  categories: () => api.get('/products/categories')
};

// ── Skin Analysis ──────────────────────────────────────────────────
export const skinApi = {
  quiz: () => api.get('/skin/quiz'),
  analyze: (data) => api.post('/skin/analyze', data),
  analyzeImage: (data) => api.post('/skin/analyze-image', data)
};

// ── Compare ────────────────────────────────────────────────────────
export const compareApi = {
  compare: (ids) => api.get('/compare', { params: { ids: ids.join(',') } }),
  priceHistory: (productId, platform) => api.get(`/compare/price-history/${productId}/${platform}`)
};

// ── Makeup ──────────────────────────────────────────────────────────
export const makeupApi = {
  recommend: (params) => api.get('/makeup/recommend', { params }),
  looks: () => api.get('/makeup/looks'),
  shadeGuide: (skinTone) => api.get(`/makeup/shade-guide/${skinTone}`),
  tutorials: () => api.get('/makeup/tutorials')
};

// ── Auth ────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  updateSkinProfile: (data) => api.patch('/auth/skin-profile', data)
};

// ── Blog ────────────────────────────────────────────────────────────
export const blogApi = {
  list: (params) => api.get('/blog', { params }),
  detail: (slug) => api.get(`/blog/${slug}`)
};

// ── Reviews ─────────────────────────────────────────────────────────
export const reviewsApi = {
  list: (productId) => api.get(`/reviews/${productId}`),
  create: (productId, data) => api.post(`/reviews/${productId}`, data)
};

export default api;
