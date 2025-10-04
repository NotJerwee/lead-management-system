export interface Lead {
	id: number;
	first_name: string;
	last_name: string;
	full_name: string;
	email: string;
	phone: string;
	budget_min: number;
	budget_max: number;
	budget_range: string;
	status: LeadStatus;
	created_at: string;
}

export interface CreateLeadData {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	budget_min: number;
	budget_max: number;
	status: LeadStatus;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  	id: number;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';

export interface LeadFilters {
	status?: LeadStatus;
	search?: string;
	page?: number;
	ordering?: string;
}

export interface LeadListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Lead[];
}

export const LEAD_STATUS_OPTIONS = [
	{ value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
	{ value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
	{ value: 'qualified', label: 'Qualified', color: 'bg-green-100 text-green-800' },
	{ value: 'closed', label: 'Closed', color: 'bg-purple-100 text-purple-800' },
	{ value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
] as const;
