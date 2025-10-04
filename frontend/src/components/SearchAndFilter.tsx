import React from 'react';

interface SearchAndFilterProps {
	searchValue: string;
	statusValue: string;
	onSearchChange: (value: string) => void;
	onStatusChange: (value: string) => void;
}

const LEAD_STATUS_OPTIONS = [
	{ value: '', label: 'All Statuses' },
	{ value: 'new', label: 'New' },
	{ value: 'contacted', label: 'Contacted' },
	{ value: 'qualified', label: 'Qualified' },
	{ value: 'closed', label: 'Closed' },
	{ value: 'lost', label: 'Lost' },
];

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
	searchValue,
	statusValue,
	onSearchChange,
	onStatusChange
}) => {
	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
		<div className="flex gap-4 items-end">
			<div className="flex-1">
			<label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
				Search
			</label>
			<input
				type="text"
				id="search"
				placeholder="Search by name or email..."
				className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={searchValue}
				onChange={(e) => onSearchChange(e.target.value)}
			/>
			</div>

			<div className="w-48">
			<label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
				Filter by Status
			</label>
			<select
				id="status"
				className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={statusValue}
				onChange={(e) => onStatusChange(e.target.value)}
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
	);
};

export default SearchAndFilter;
