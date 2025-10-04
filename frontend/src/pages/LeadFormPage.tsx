import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { leadService } from '../services/leadService';
import type { LeadStatus } from '../types/leads';
import { LEAD_STATUS_OPTIONS } from '../types/leads';

interface LeadFormData {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	budget_min: number;
	budget_max: number;
	status: LeadStatus;
}

const LeadFormPage: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LeadFormData>({
		defaultValues: {
			first_name: '',
			last_name: '',
			email: '',
			phone: '',
			budget_min: 0,
			budget_max: 0,
			status: 'new',
		},
	});

	// Use useMemo to prevent validation recreation
	const validation = useMemo(() => ({
		required: (field: string) => ({ required: `${field} is required` }),
		email: {
			required: 'Email is required',
			pattern: {
				value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				message: 'Invalid email address'
			}
		},
		budgetMin: {
			required: 'Minimum budget is required',
			min: { value: 0, message: 'Budget must be positive' }
		},
		budgetMax: {
			required: 'Maximum budget is required',
			min: { value: 0, message: 'Budget must be positive' }
		}
	}), []);

	const onSubmit = async (data: LeadFormData) => {
		try {
		setLoading(true);
		setError(null);

		await leadService.createLead(data);
		navigate('/dashboard');
		} catch (err: any) {
		setError(err.response?.data?.detail || 'Failed to save lead');
		} finally {
		setLoading(false);
		}
	};

	const handleCancel = () => {
		navigate('/dashboard');
	};

	const FormInput = ({ 
		id, 
		label, 
		type = 'text', 
		required = false, 
		validation: validationRules,
		...props 
	}: {
		id: keyof LeadFormData;
		label: string;
		type?: string;
		required?: boolean;
		validation?: any;
		[key: string]: any;
	}) => (
		<div>
			<label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
				{label} {required && '*'}
			</label>
			<input
				type={type}
				id={id}
				className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				{...register(id, validationRules)}
				{...props}
			/>
			{errors[id] && (
				<p className="mt-1 text-sm text-red-600">{errors[id]?.message}</p>
			)}
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
					<h1 className="text-2xl font-bold text-gray-900">
						Add New Lead
					</h1>
					</div>
				</div>
				</div>
			</div>

			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-white shadow rounded-lg">
				<form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
					{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
					)}

					<div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormInput
								id="first_name"
								label="First Name"
								required
								validation={validation.required('First name')}
							/>
							<FormInput
								id="last_name"
								label="Last Name"
								required
								validation={validation.required('Last name')}
							/>
							<FormInput
								id="email"
								label="Email"
								type="email"
								required
								validation={validation.email}
							/>
							<FormInput
								id="phone"
								label="Phone"
								type="tel"
								required
								validation={validation.required('Phone number')}
							/>
						</div>
					</div>

					<div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormInput
							id="budget_min"
							label="Minimum Budget"
							type="number"
							required
							validation={validation.budgetMin}
							min="0"
						/>
						<FormInput
							id="budget_max"
							label="Maximum Budget"
							type="number"
							required
							validation={validation.budgetMax}
							min="0"
						/>
						</div>
					</div>

					<div>
					<div className="grid grid-cols-1 gap-4">
						<div>
						<label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
							Status
						</label>
						<select
							id="status"
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							{...register('status')}
						>
							{LEAD_STATUS_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
							))}
						</select>
						</div>
					</div>
					</div>

					<div className="flex justify-end space-x-4 pt-6">
					<button
						type="button"
						onClick={handleCancel}
						className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={loading}
						className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						{loading ? 'Saving...' : 'Create Lead'}
					</button>
					</div>
				</form>
				</div>
			</div>
		</div>
	);
};

export default LeadFormPage;
