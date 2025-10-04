import axios from 'axios';
import type { 
	Lead, 
	CreateLeadData, 
	LeadFilters, 
	LeadListResponse 
} from '../types/leads';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('access_token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			const refreshToken = localStorage.getItem('refresh_token');
			if (refreshToken) {
				try {
					const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
						refresh: refreshToken,
					});
					const { access } = response.data;
					localStorage.setItem('access_token', access);
					
					error.config.headers.Authorization = `Bearer ${access}`;
					return api(error.config);
				} catch (refreshError) {
					localStorage.removeItem('access_token');
					localStorage.removeItem('refresh_token');
					window.location.href = '/login';
				}
			} else {
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export const leadService = {
	async getLeads(filters: LeadFilters = {}): Promise<LeadListResponse> {
		const params = new URLSearchParams();
		
		if (filters.status) params.append('status', filters.status);
		if (filters.search) params.append('search', filters.search);
		if (filters.page) params.append('page', filters.page.toString());
		if (filters.ordering) params.append('ordering', filters.ordering);
		
		const response = await api.get(`/leads/?${params.toString()}`);
		return response.data;
	},

	async createLead(data: CreateLeadData): Promise<Lead> {
		const response = await api.post('/leads/', data);
		return response.data;
	},
};
