import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../types/auth';

const LoginPage: React.FC = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginCredentials>();

	const onSubmit = async (data: LoginCredentials) => {
		setIsLoading(true);
		setError(null);

		try {
		await login(data);
		navigate('/dashboard');
		} catch (err: any) {
		setError(err.response?.data?.detail || 'Login failed. Please try again.');
		} finally {
		setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
		<div className="max-w-md w-full space-y-6">
			<div>
			<h2 className="text-center text-2xl font-bold text-gray-900">
				Sign in to your account
			</h2>
			</div>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
				<input
					{...register('username', {
					required: 'Username is required',
					minLength: {
						value: 3,
						message: 'Username must be at least 3 characters'
					}
					})}
					type="text"
					autoComplete="username"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					placeholder="Username"
				/>
				{errors.username && (
					<p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
				)}
				</div>
				<div>
				<input
					{...register('password', {
					required: 'Password is required',
					minLength: {
						value: 6,
						message: 'Password must be at least 6 characters'
					}
					})}
					type="password"
					autoComplete="current-password"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					placeholder="Password"
				/>
				{errors.password && (
					<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
				)}
				</div>

			{error && (
				<div className="rounded-md bg-red-50 p-4">
				<div className="text-sm text-red-700">{error}</div>
				</div>
			)}

			<div>
				<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
				>
				{isLoading ? 'Signing in...' : 'Sign in'}
				</button>
			</div>

			<p className="text-center text-sm text-gray-600">
				<Link
				to="/register"
				className="font-medium text-blue-600 hover:text-blue-500"
				>
				Create a new account
				</Link>
			</p>
			</form>
		</div>
		</div>
	);
};

export default LoginPage;
