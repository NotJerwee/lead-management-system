export interface User {
	id: number;
	username: string;
	email: string;
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface RegisterCredentials {
	username: string;
	email: string;
	password: string;
	password_confirm: string;
}

export interface AuthResponse {
	access: string;
	refresh: string;
	user: User;
}

export interface AuthContextType {
	user: User | null;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
	isAuthenticated: boolean;
}
