import React from 'react';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	pageSize?: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	totalCount,
	pageSize = 10,
	onPageChange
}) => {
	if (totalPages <= 1) {
		return null;
	}

	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;
		
		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			const start = Math.max(1, currentPage - 2);
			const end = Math.min(totalPages, start + maxVisible - 1);
			
			for (let i = start; i <= end; i++) {
				pages.push(i);
			}
		}
		
		return pages;
	};

	const buttonClass = "relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer";
	const activeButtonClass = "z-10 bg-blue-50 border-blue-500 text-blue-600";
	const inactiveButtonClass = "bg-white border-gray-300 text-gray-500 hover:bg-gray-50";
	const disabledButtonClass = "opacity-50 cursor-not-allowed";

	return (
		<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
			<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-700">
						Showing{' '}
						<span className="font-medium">
							{Math.min((currentPage - 1) * pageSize + 1, totalCount)}
						</span>{' '}
						to{' '}
						<span className="font-medium">
							{Math.min(currentPage * pageSize, totalCount)}
						</span>{' '}
						of{' '}
						<span className="font-medium">{totalCount}</span> results
					</p>
				</div>
				<div>
					<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
						<button
							onClick={() => onPageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className={`${buttonClass} px-2 rounded-l-md text-gray-500 hover:bg-gray-50 disabled:${disabledButtonClass}`}
						>
							Previous
						</button>
						
						{getPageNumbers().map((pageNum) => (
							<button
								key={pageNum}
								onClick={() => onPageChange(pageNum)}
								className={`${buttonClass} ${
									pageNum === currentPage ? activeButtonClass : inactiveButtonClass
								}`}
							>
								{pageNum}
							</button>
						))}
						
						<button
							onClick={() => onPageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className={`${buttonClass} px-2 rounded-r-md text-gray-500 hover:bg-gray-50 disabled:${disabledButtonClass}`}
						>
							Next
						</button>
					</nav>
				</div>
			</div>
		</div>
	);
};

export default Pagination;
