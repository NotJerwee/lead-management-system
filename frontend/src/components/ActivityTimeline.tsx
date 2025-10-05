import React, { useState } from 'react';
import type { Activity, CreateActivityData } from '../types/leads';
import ActivityForm from './ActivityForm';

interface ActivityTimelineProps {
	activities: Activity[];
	onUpdateActivity: (id: number, data: Partial<CreateActivityData>) => void;
	onDeleteActivity: (id: number) => void;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
	activities,
	onUpdateActivity,
	onDeleteActivity,
}) => {
	const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return {
		date: date.toLocaleDateString(),
		time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
		};
	};

	const formatDuration = (minutes: number) => {
		if (minutes < 60) {
			return `${minutes}m`;
		}
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
	};

	const handleEditActivity = (activity: Activity) => {
		setEditingActivity(activity);
	};

	const handleUpdateActivity = (data: CreateActivityData) => {
		if (editingActivity) {
		onUpdateActivity(editingActivity.id, data);
		setEditingActivity(null);
		}
	};

	const handleDeleteActivity = (id: number) => {
		onDeleteActivity(id);
		setShowDeleteConfirm(null);
	};

	if (activities.length === 0) {
		return (
		<div className="text-center py-8">
			<h3 className="text-lg font-medium text-gray-900">No activities yet</h3>
		</div>
		);
	}

	return (
		<div className="space-y-4">
		{activities.map((activity, index) => {
            const { date } = formatDate(activity.activity_date);

			return (
				<div key={activity.id || `activity-${index}`} className="relative">
					<div className="flex items-start">
						<div className="flex-1 min-w-0">
							<div className="bg-gray-50 rounded-lg p-4">
							<div className="flex items-center justify-between mb-2">
								<h4 className="text-sm font-semibold text-gray-900">
								{activity.title}
								</h4>
								<div className="flex space-x-1">
								<button
									onClick={() => handleEditActivity(activity)}
									className="text-gray-500 hover:text-blue-600 text-xs cursor-pointer px-2 py-1 rounded hover:bg-blue-50"
								>
									Edit
								</button>
								<button
									onClick={() => setShowDeleteConfirm(activity.id)}
									className="text-gray-500 hover:text-red-600 text-xs cursor-pointer px-2 py-1 rounded hover:bg-red-50"
								>
									Delete
								</button>
								</div>
							</div>

                            {activity.activity_type === 'call' && (
								<div className="mb-2">
								<span className="text-xs text-gray-500">
                                    {date} • {formatDuration(activity.duration || 0)}
								</span>
								</div>
							)}

							{activity.notes && (
								<div>
								<p className="text-sm text-gray-700 whitespace-pre-wrap">
									{activity.notes}
								</p>
								</div>
							)}
							</div>
						</div>
					</div>
				</div>
			);
		})}

		{editingActivity && (
			<div className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
				<div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 border border-gray-200">
					<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900">Edit Activity</h3>
					<button
						onClick={() => setEditingActivity(null)}
						className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl font-bold"
					>
						X
					</button>
					</div>
                    <ActivityForm
                    leadId={editingActivity.lead}
                    onSubmit={handleUpdateActivity}
                    initialData={{
                        activity_type: editingActivity.activity_type,
                        title: editingActivity.title,
                        notes: editingActivity.notes,
                        activity_date: editingActivity.activity_date.slice(0, 16),
                        duration: editingActivity.duration,
                    } as any}
                    />
				</div>
			</div>
		)}

		{showDeleteConfirm && (
			<div className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
				<div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
					<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900">Delete Activity</h3>
					<button
						onClick={() => setShowDeleteConfirm(null)}
						className="text-gray-400 hover:text-gray-600 cursor-pointer text-xl font-bold"
					>
						X
					</button>
					</div>
					<p className="text-gray-600 mb-6">
						Are you sure you want to delete this activity? This action cannot be undone.
					</p>
					<div className="flex justify-end">
					<button
						onClick={() => handleDeleteActivity(showDeleteConfirm)}
						className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
					>
						Delete
					</button>
					</div>
				</div>
			</div>
		)}
		</div>
	);
};

export default ActivityTimeline;

