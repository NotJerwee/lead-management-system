import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
	const { user, logout } = useAuth();

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
		</div>
	);
};

export default Dashboard;
