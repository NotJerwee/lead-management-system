import type { Activity, CreateActivityData, UpdateActivityData } from '../types/leads';

const API_BASE_URL = 'http://localhost:8000/api';

class ActivityService {
  	private getAuthHeaders(): HeadersInit {
		const token = localStorage.getItem('access_token');
		return {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		};
	}

	async getActivities(leadId?: number): Promise<Activity[]> {
		const url = leadId 
		? `${API_BASE_URL}/activities/?lead=${leadId}`
		: `${API_BASE_URL}/activities/`;
		
		const response = await fetch(url, {
			headers: this.getAuthHeaders(),
		});

		if (!response.ok) {
			throw new Error('Failed to fetch activities');
		}

		const data = await response.json();
		return data.results || data;
	}

	async getActivity(id: number): Promise<Activity> {
		const response = await fetch(`${API_BASE_URL}/activities/${id}/`, {
			headers: this.getAuthHeaders(),
		});

		if (!response.ok) {
			throw new Error('Failed to fetch activity');
		}

		return response.json();
	}

	async createActivity(activityData: CreateActivityData): Promise<Activity> {
		const response = await fetch(`${API_BASE_URL}/activities/`, {
			method: 'POST',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(activityData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || 'Failed to create activity');
		}

		return response.json();
	}

	async updateActivity(id: number, activityData: Partial<UpdateActivityData>): Promise<Activity> {
		const response = await fetch(`${API_BASE_URL}/activities/${id}/`, {
			method: 'PATCH',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(activityData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || 'Failed to update activity');
		}

		return response.json();
	}

	async deleteActivity(id: number): Promise<void> {
		const response = await fetch(`${API_BASE_URL}/activities/${id}/`, {
			method: 'DELETE',
			headers: this.getAuthHeaders(),
		});

		if (!response.ok) {
			throw new Error('Failed to delete activity');
		}
	}
}

export const activityService = new ActivityService();