import axios from 'axios';
import type { LoginCredentials, RegisterCredentials, User, AuthResponse } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('access_token');
		if (token) {
		config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
		originalRequest._retry = true;

		try {
			const refreshToken = localStorage.getItem('refresh_token');
			if (refreshToken) {
			const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
				refresh: refreshToken,
			});

			const { access } = response.data;
			localStorage.setItem('access_token', access);
			
			originalRequest.headers.Authorization = `Bearer ${access}`;
			return api(originalRequest);
			}
		} catch (refreshError) {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			window.location.href = '/login';
			return Promise.reject(refreshError);
		}
		}

		return Promise.reject(error);
	}
);

export const authService = {
	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		const response = await api.post('/auth/login/', credentials);
		return response.data;
	},

	async register(credentials: RegisterCredentials): Promise<AuthResponse> {
		const response = await api.post('/auth/register/', credentials);
		return response.data;
	},

	async getCurrentUser(): Promise<User> {
		const response = await api.get('/auth/me/');
		return response.data;
  },
};
