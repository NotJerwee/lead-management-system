import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AnalyticsData } from '../types/leads';
import { leadService } from '../services/leadService';
import { LEAD_STATUS_OPTIONS } from '../types/leads';

const AnalyticsDashboard: React.FC = () => {
	const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadAnalytics();
	}, []);

	const loadAnalytics = async () => {
		try {
			setLoading(true);
			const data = await leadService.getAnalytics();
			setAnalytics(data);
		} catch (err) {
			setError('Failed to load analytics data');
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const formatDuration = (minutes: number) => {
		if (minutes < 60) {
			return `${minutes}m`;
		}
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
	};

	const prepareChartData = () => {
		if (!analytics) return [];
		
		return LEAD_STATUS_OPTIONS.map(option => ({
			status: option.label,
			count: analytics.leads_by_status[option.value] || 0,
			fill: getStatusColor(option.value)
		}));
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'new':
				return '#3B82F6';
			case 'contacted':
				return '#EAB308';
			case 'qualified':
				return '#10B981';
			case 'closed':
				return '#8B5CF6';
			case 'lost':
				return '#EF4444';
			default:
				return '#6B7280';
		}
	};

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow p-8">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-2 text-gray-600">Loading analytics...</p>
				</div>
			</div>
		);
	}

	if (error || !analytics) {
		return (
			<div className="bg-white rounded-lg shadow p-8">
				<div className="text-center">
					<div className="text-red-600 mb-2">Error loading analytics</div>
					<p className="text-gray-600">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white rounded-lg shadow p-6">
					<p className="text-sm font-medium text-blue-600">Total Leads</p>
					<p className="text-2xl font-semibold text-gray-900">{analytics.total_leads}</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<p className="text-sm font-medium text-green-600">Conversion Rate</p>
					<p className="text-2xl font-semibold text-gray-900">{analytics.conversion_metrics.conversion_rate}%</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<p className="text-sm font-medium text-yellow-600">Qualification Rate</p>
					<p className="text-2xl font-semibold text-gray-900">{analytics.conversion_metrics.qualification_rate}%</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<p className="text-sm font-medium text-red-600">Lost Rate</p>
					<p className="text-2xl font-semibold text-gray-900">{analytics.conversion_metrics.lost_rate}%</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Status</h3>
					<div className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={prepareChartData()}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis 
									dataKey="status" 
									tick={{ fontSize: 12 }}
									angle={-45}
									textAnchor="end"
									height={80}
								/>
								<YAxis tick={{ fontSize: 12 }} />
								<Tooltip 
									formatter={(value: number) => [value, 'Leads']}
									labelFormatter={(label) => `Status: ${label}`}
								/>
								<Bar dataKey="count" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
					<div className="space-y-3">
						{analytics.recent_activities.length === 0 ? (
							<p className="text-gray-500 text-center py-4">No recent activities</p>
						) : (
							analytics.recent_activities.map(activity => (
								<div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium text-gray-900 truncate">
											{activity.title}
										</p>
										<span className="text-xs text-gray-500">
											{formatDate(activity.created_at)}
										</span>
									</div>
									<p className="text-xs text-gray-600 truncate">
										{activity.lead_name} • {activity.activity_type_display}
										{activity.activity_type === 'call' && activity.duration && (
											<span> • {formatDuration(activity.duration)}</span>
										)}
									</p>
									{activity.notes && (
										<p className="text-xs text-gray-500 mt-1 line-clamp-2">
											{activity.notes}
										</p>
									)}
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsDashboard;
