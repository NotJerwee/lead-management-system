import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { leadService } from '../services/leadService';
import type { Lead, LeadFilters, LeadStatus } from '../types/leads';
import SearchAndFilter from '../components/SearchAndFilter';
import LeadsTable from '../components/LeadsTable';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const Dashboard: React.FC = () => {
	const { user, logout } = useAuth();
	const [activeTab, setActiveTab] = useState<'leads' | 'analytics'>('leads');
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	
	const [filters, setFilters] = useState<LeadFilters>({
		search: '',
		status: undefined,
	});

	const loadLeads = async () => {
		try {
			setLoading(true);
			setError(null);
			
			const response = await leadService.getLeads({
				...filters,
				page: currentPage,
				ordering: '-created_at',
			});
			
			setLeads(response.results);
			setTotalCount(response.count);
			setTotalPages(Math.ceil(response.count / 10));
		} catch (err: any) {
			setError(err.response?.data?.detail || 'Failed to load leads');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadLeads();
	}, [currentPage, filters.status, filters.search]);

	const handleSearch = (searchTerm: string) => {
		setFilters(prev => ({ ...prev, search: searchTerm }));
		setCurrentPage(1);
	};

	const handleStatusFilter = (status: LeadStatus | undefined) => {
		setFilters(prev => ({ ...prev, status }));
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<h1 className="text-xl font-semibold text-gray-900">
								Real Estate CRM
							</h1>
						</div>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-700">
								Welcome, {user?.username}
							</span>
							<button
								onClick={logout}
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-2xl font-bold">Lead Management</h2>
					<Link
						to="/leads/new"
						className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
					>
						Add New Lead
					</Link>
				</div>

				<div className="mb-6">
					<div className="border-b border-gray-200">
						<nav className="-mb-px flex space-x-8">
							<button
								onClick={() => setActiveTab('leads')}
								className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
									activeTab === 'leads'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								Leads
							</button>
							<button
								onClick={() => setActiveTab('analytics')}
								className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
									activeTab === 'analytics'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								Analytics
							</button>
						</nav>
					</div>
				</div>

				{activeTab === 'leads' ? (
					<>
						<SearchAndFilter
							searchValue={filters.search || ''}
							statusValue={filters.status || ''}
							onSearchChange={handleSearch}
							onStatusChange={(value) => handleStatusFilter(value as LeadStatus || undefined)}
						/>

						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
								{error}
							</div>
						)}

						<LeadsTable
							leads={leads}
							loading={loading}
							error={error}
							currentPage={currentPage}
							totalPages={totalPages}
							totalCount={totalCount}
							pageSize={10}
							onPageChange={handlePageChange}
						/>
					</>
				) : (
					<AnalyticsDashboard />
				)}
			</div>
		</div>
	);
};

export default Dashboard;