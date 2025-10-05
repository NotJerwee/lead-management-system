import React, { useState } from 'react';
import type { CreateActivityData } from '../types/leads';
import { ACTIVITY_TYPE_OPTIONS } from '../types/leads';

interface ErrorMessageProps {
	error?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
	if (!error) return null;
	return <p className="text-red-500 text-sm mt-1">{error}</p>;
};

interface ActivityFormProps {
	leadId: number;
	onSubmit: (data: CreateActivityData) => void;
	initialData?: Partial<CreateActivityData>;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
	leadId,
	onSubmit,
	initialData
}) => {
    const [formData, setFormData] = useState<CreateActivityData>({
        lead: leadId,
        activity_type: initialData?.activity_type || 'note',
        title: initialData?.title || '',
        notes: initialData?.notes || '',
        activity_date: (initialData as any)?.activity_date || (initialData as any)?.date || new Date().toISOString().slice(0, 16),
        duration: (initialData as any)?.duration ?? (initialData as any)?.duration_minutes ?? undefined,
    });

	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.activity_type === 'call' && !formData.activity_date) {
      newErrors.date = 'Date is required for calls';
    }

    if (formData.activity_type === 'call') {
      if (!formData.duration || formData.duration <= 0) {
        newErrors.duration_minutes = 'Duration is required for calls';
      }
    }

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (validateForm()) {
		onSubmit(formData);
		}
	};

	const handleChange = (field: keyof CreateActivityData, value: any) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		
		if (errors[field]) {
		setErrors(prev => ({ ...prev, [field]: '' }));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
				Activity Type
				</label>
				<select
				value={formData.activity_type}
				onChange={(e) => handleChange('activity_type', e.target.value)}
				className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
				{ACTIVITY_TYPE_OPTIONS.map(option => (
					<option key={option.value} value={option.value}>
					{option.label}
					</option>
				))}
				</select>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
				Title *
				</label>
				<input
					type="text"
					value={formData.title}
					onChange={(e) => handleChange('title', e.target.value)}
					className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						errors.title ? 'border-red-500' : 'border-gray-300'
					}`}
					placeholder="Enter activity title"
				/>
				<ErrorMessage error={errors.title} />
			</div>

			{formData.activity_type === 'call' && (
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Date & Time *
				</label>
				<input
					type="datetime-local"
					value={formData.activity_date}
					onChange={(e) => handleChange('activity_date', e.target.value)}
					className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					errors.date ? 'border-red-500' : 'border-gray-300'
					}`}
				/>
				<ErrorMessage error={errors.date} />
				</div>
			)}

			{formData.activity_type === 'call' && (
				<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Duration (minutes) *
				</label>
				<input
					type="number"
					min="1"
					value={formData.duration || ''}
					onChange={(e) => handleChange('duration', e.target.value ? Number(e.target.value) : undefined)}
					className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					errors.duration_minutes ? 'border-red-500' : 'border-gray-300'
					}`}
						placeholder="Enter duration in minutes"
					/>
					<ErrorMessage error={errors.duration_minutes} />
				</div>
			)}

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Notes
				</label>
				<textarea
					value={formData.notes}
					onChange={(e) => handleChange('notes', e.target.value)}
					rows={4}
					className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter activity notes"
				/>
			</div>

			<div className="pt-4">
				<button
					type="submit"
					className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
				>
					{initialData ? 'Update Activity' : 'Add Activity'}
				</button>
			</div>
		</form>
	);
};

export default ActivityForm;

