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
	updated_at: string;
	is_deleted: boolean;
	activities?: Activity[];
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
	{ value: 'new', label: 'New' },
	{ value: 'contacted', label: 'Contacted' },
	{ value: 'qualified', label: 'Qualified' },
	{ value: 'closed', label: 'Closed' },
	{ value: 'lost', label: 'Lost' },
] as const;

export interface Activity {
	id: number;
	lead: number;
	lead_name: string;
	activity_type: ActivityType;
	activity_type_display: string;
	title: string;
	notes: string;
	date: string;
	duration_minutes?: number;
	created_by: number;
	created_at: string;
	updated_at: string;
}

export interface CreateActivityData {
	lead: number;
	activity_type: ActivityType;
	title: string;
	notes?: string;
	date: string;
	duration_minutes?: number;
}

export interface UpdateActivityData extends Partial<CreateActivityData> {
	id: number;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'note';

export const ACTIVITY_TYPE_OPTIONS = [
	{ value: 'call', label: 'Call' },
	{ value: 'email', label: 'Email' },
	{ value: 'meeting', label: 'Meeting' },
	{ value: 'note', label: 'Note' },
] as const;

export interface ConversionMetrics {
	conversion_rate: number;
	qualification_rate: number;
	lost_rate: number;
	total_leads: number;
}

export interface AnalyticsData {
	total_leads: number;
	leads_by_status: Record<string, number>;
	recent_activities: Activity[];
	conversion_metrics: ConversionMetrics;
}
