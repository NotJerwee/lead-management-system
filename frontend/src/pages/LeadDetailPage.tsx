import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Lead, Activity, CreateActivityData } from '../types/leads';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '../types/leads';
import { leadService } from '../services/leadService';
import { activityService } from '../services/activityService';
import ActivityForm from '../components/ActivityForm';
import ActivityTimeline from '../components/ActivityTimeline';

const LeadDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const getStatusBadgeColor = (status: string) => {
		switch (status) {
		case 'new':
			return 'bg-blue-100 text-blue-800';
		case 'contacted':
			return 'bg-yellow-100 text-yellow-800';
		case 'qualified':
			return 'bg-green-100 text-green-800';
		case 'closed':
			return 'bg-purple-100 text-purple-800';
		case 'lost':
			return 'bg-red-100 text-red-800';
		default:
			return 'bg-gray-100 text-gray-800';
		}
	};
	const [lead, setLead] = useState<Lead | null>(null);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showActivityForm, setShowActivityForm] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		budget_min: 0,
		budget_max: 0,
        status: 'new' as any,
        source: 'other' as any,
        property_interest: '',
	});

	useEffect(() => {
		if (id) {
		loadLeadData();
		}
	}, [id]);

	const loadLeadData = async () => {
		try {
			setLoading(true);
			const leadData = await leadService.getLead(Number(id));
			setLead(leadData);
            setEditForm({
				first_name: leadData.first_name,
				last_name: leadData.last_name,
				email: leadData.email,
				phone: leadData.phone,
				budget_min: leadData.budget_min,
				budget_max: leadData.budget_max,
                status: leadData.status,
                source: (leadData as any).source || 'other',
                property_interest: (leadData as any).property_interest || '',
			});
			
			const activitiesData = await activityService.getActivities(leadData.id);
			setActivities(activitiesData);
		} catch (err) {
			setError('Failed to load lead data');
		} finally {
			setLoading(false);
		}
	};

	const handleAddActivity = async (activityData: CreateActivityData) => {
		try {
			const newActivity = await activityService.createActivity(activityData);
			setActivities(prev => [newActivity, ...prev]);
			setShowActivityForm(false);
		} catch (err) {
			setError('Failed to create activity');
		}
	};

	const handleUpdateActivity = async (id: number, data: Partial<CreateActivityData>) => {
		try {
			const updatedActivity = await activityService.updateActivity(id, data);
			setActivities(prev => 
				prev.map(activity => 
				activity.id === id ? updatedActivity : activity
				)
			);
		} catch (err) {
			setError('Failed to update activity');
		}
	};

	const handleDeleteActivity = async (id: number) => {
		try {
			await activityService.deleteActivity(id);
			setActivities(prev => prev.filter(activity => activity.id !== id));
		} catch (err) {
			setError('Failed to delete activity');
		}
	};

	const handleUpdateLead = async () => {
		if (!lead) return;
		
		try {
			const updatedLead = await leadService.updateLead(lead.id, editForm);
			setLead(updatedLead);
			setIsEditing(false);
		} catch (err) {
			setError('Failed to update lead');
		}
	};

	const handleSoftDelete = async () => {
		if (!lead) return;
		
		try {
			await leadService.softDeleteLead(lead.id);
			navigate('/dashboard');
		} catch (err) {
			setError('Failed to delete lead');
		}
	};

	if (loading) {
		return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
				<p className="mt-4 text-gray-600">Loading lead details...</p>
			</div>
		</div>
		);
	}

	if (error || !lead) {
		return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="text-center">
				<div className="text-red-600 text-xl mb-4">Error</div>
				<p className="text-gray-600 mb-4">{error || 'Lead not found'}</p>
				<button
					onClick={() => navigate('/dashboard')}
					className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
				>
					Back to Dashboard
				</button>
			</div>
		</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">{lead.full_name}</h1>
						</div>
						<div className="flex space-x-3">
							<button
								onClick={() => navigate('/dashboard')}
								className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
							>
								Back to Dashboard
							</button>
							<button
								onClick={() => setShowActivityForm(true)}
								className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
							>
								Add Activity
							</button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-gray-900">Lead Information</h2>
							<button
							onClick={() => setIsEditing(!isEditing)}
							className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
							>
							{isEditing ? 'Cancel' : 'Edit'}
							</button>
						</div>

						{isEditing ? (
							<div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
								<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									First Name
								</label>
								<input
									type="text"
									value={editForm.first_name}
									onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								</div>
								<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Last Name
								</label>
								<input
									type="text"
									value={editForm.last_name}
									onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								</div>
							</div>
							
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									type="email"
									value={editForm.email}
									onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Phone
									</label>
									<input
										type="tel"
										value={editForm.phone}
										onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
										className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Min Budget
										</label>
									<input
										type="number"
										value={editForm.budget_min}
										onChange={(e) => setEditForm(prev => ({ ...prev, budget_min: Number(e.target.value) }))}
										className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Max Budget
										</label>
									<input
										type="number"
										value={editForm.budget_max}
										onChange={(e) => setEditForm(prev => ({ ...prev, budget_max: Number(e.target.value) }))}
										className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									</div>
								</div>
							
                                <div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Status
									</label>
									<select
										value={editForm.status}
										onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
										className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
									{LEAD_STATUS_OPTIONS.map(option => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
									</select>
								</div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Source
                                    </label>
                                    <select
                                        value={editForm.source}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, source: e.target.value as any }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                    {LEAD_SOURCE_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Property Interest
                                    </label>
                                    <textarea
                                        value={editForm.property_interest}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, property_interest: e.target.value }))}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
							
								<div className="flex space-x-3">
									<button
										onClick={handleUpdateLead}
										className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
									>
										Save Changes
									</button>
									<button
										onClick={() => setIsEditing(false)}
										className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
                            <div className="space-y-4">
								<div>
									<label className="text-sm font-medium text-gray-500">Email</label>
									<p className="text-gray-900">{lead.email}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Phone</label>
									<p className="text-gray-900">{lead.phone}</p>
								</div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Source</label>
                                    <p className="text-gray-900">{LEAD_SOURCE_OPTIONS.find(s => s.value === (lead as any).source)?.label || (lead as any).source}</p>
                                </div>
                                {Boolean((lead as any).property_interest) && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Property Interest</label>
                                        <p className="text-gray-900 whitespace-pre-wrap">{(lead as any).property_interest}</p>
                                    </div>
                                )}
								<div>
									<label className="text-sm font-medium text-gray-500">Budget Range</label>
									<p className="text-gray-900">{lead.budget_range}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Status</label>
									<div className="mt-1">
									<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(lead.status)}`}>
										{LEAD_STATUS_OPTIONS.find(s => s.value === lead.status)?.label || lead.status}
									</span>
									</div>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">Created</label>
									<p className="text-gray-900">{new Date(lead.created_at).toLocaleDateString()}</p>
								</div>
							</div>
						)}

							<div className="mt-6">
								<button
									onClick={() => setShowDeleteConfirm(true)}
									className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
								>
									Delete Lead
								</button>
							</div>
						</div>
					</div>

					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-6">Activity Timeline</h2>
							<ActivityTimeline
								activities={activities}
								onUpdateActivity={handleUpdateActivity}
								onDeleteActivity={handleDeleteActivity}
							/>
						</div>
					</div>
				</div>

				{showActivityForm && (
				<div className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 border border-gray-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Add New Activity</h3>
						<button
						onClick={() => setShowActivityForm(false)}
						className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl font-bold"
						>
						X
						</button>
					</div>
					<ActivityForm
						leadId={lead.id}
						onSubmit={handleAddActivity}
					/>
					</div>
				</div>
				)}

				{showDeleteConfirm && (
				<div className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Delete Lead</h3>
						<button
						onClick={() => setShowDeleteConfirm(false)}
						className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl font-bold"
						>
						X
						</button>
					</div>
					<p className="text-gray-600 mb-6">
						Are you sure you want to delete this lead? This action cannot be undone.
					</p>
					<div className="flex justify-end">
						<button
						onClick={handleSoftDelete}
						className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
						>
						Delete
						</button>
					</div>
					</div>
				</div>
				)}
			</div>
		</div>
	);
};

export default LeadDetailPage;

