import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType, User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem('access_token');
		if (storedToken) {
		authService.getCurrentUser()
			.then(setUser)
			.catch(() => {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			})
			.finally(() => setIsLoading(false));
		} else {
		setIsLoading(false);
		}
	}, []);

	const login = async (credentials: LoginCredentials): Promise<void> => {
		const response: AuthResponse = await authService.login(credentials);
		const { access, refresh, user: userData } = response;
		
		localStorage.setItem('access_token', access);
		localStorage.setItem('refresh_token', refresh);
		setUser(userData);
	};

	const register = async (credentials: RegisterCredentials): Promise<void> => {
		const response: AuthResponse = await authService.register(credentials);
		const { access, refresh, user: userData } = response;
		
		localStorage.setItem('access_token', access);
		localStorage.setItem('refresh_token', refresh);
		setUser(userData);
	};

	const logout = (): void => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		setUser(null);
	};

	const value: AuthContextType = {
		user,
		login,
		register,
		logout,
		isLoading,
		isAuthenticated: !!user,
	};

	return (
		<AuthContext.Provider value={value}>
		{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
