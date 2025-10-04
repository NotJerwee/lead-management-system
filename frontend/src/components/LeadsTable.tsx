import React from 'react';
import type { Lead } from '../types/leads';
import Pagination from './Pagination';

interface LeadsTableProps {
	leads: Lead[];
	loading: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	totalCount: number;
	pageSize?: number;
	onPageChange: (page: number) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ 
	leads, 
	loading, 
	error, 
	currentPage, 
	totalPages, 
	totalCount, 
	pageSize = 10,
	onPageChange 
}) => {
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

	const formatStatus = (status: string) => {
		return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
	};

	const formatBudget = (budgetRange: string) => {
		return budgetRange;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	if (loading) {
		return (
		<div className="bg-white rounded-lg shadow">
			<div className="p-8 text-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
			<p className="mt-2 text-gray-600">Loading leads...</p>
			</div>
		</div>
		);
	}

	if (error) {
		return (
		<div className="bg-white rounded-lg shadow">
			<div className="p-8 text-center">
			<div className="text-red-600 mb-2">Error loading leads</div>
			<p className="text-gray-600">{error}</p>
			</div>
		</div>
		);
	}

	if (leads.length === 0) {
		return (
		<div className="bg-white rounded-lg shadow">
			<div className="p-8 text-center">
			<div className="text-gray-600 mb-2">No leads found</div>
			<p className="text-gray-500">Try adjusting your search or filter criteria</p>
			</div>
		</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow overflow-hidden">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						Name
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						Email
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						Phone
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						Status
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						Budget Range
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
						Date Created
					</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{leads.map((lead) => (
					<tr key={lead.id} className="hover:bg-gray-50">
						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm font-medium text-gray-900">
								{lead.full_name}
							</div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm text-gray-900">{lead.email}</div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm text-gray-900">{lead.phone}</div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(lead.status)}`}>
								{formatStatus(lead.status)}
							</span>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm text-gray-900">
								{formatBudget(lead.budget_range)}
							</div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<div className="text-sm text-gray-900">
								{formatDate(lead.created_at)}
							</div>
						</td>
					</tr>
					))}
				</tbody>
				</table>
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalCount={totalCount}
				pageSize={pageSize}
				onPageChange={onPageChange}
			/>
		</div>
	);
};

export default LeadsTable;
