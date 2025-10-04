import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterCredentials } from '../types/auth';

const RegisterPage: React.FC = () => {
	const { register: registerUser } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<RegisterCredentials>();

	const password = watch('password');

	const onSubmit = async (data: RegisterCredentials) => {
		setIsLoading(true);
		setError(null);

		try {
		await registerUser(data);
		navigate('/dashboard');
		} catch (err: any) {
		setError(err.response?.data?.detail || 'Registration failed. Please try again.');
		} finally {
		setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
		<div className="max-w-md w-full space-y-6">
			<div>
			<h2 className="text-center text-2xl font-bold text-gray-900">
				Create your account
			</h2>
			</div>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
				<label className="block text-sm font-medium text-gray-700">
					Username
				</label>
				<input
					{...register('username', {
					required: 'Username is required',
					minLength: {
						value: 3,
						message: 'Username must be at least 3 characters'
					}
					})}
					type="text"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					placeholder="Username"
				/>
				{errors.username && (
					<p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
				)}
				</div>

				<div>
				<label className="block text-sm font-medium text-gray-700">
					Email Address
				</label>
				<input
					{...register('email', {
					required: 'Email is required',
					pattern: {
						value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
						message: 'Please enter a valid email address'
					}
					})}
					type="email"
					autoComplete="email"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					placeholder="Email address"
				/>
				{errors.email && (
					<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
				)}
				</div>

				<div>
				<label className="block text-sm font-medium text-gray-700">
					Password
				</label>
				<input
					{...register('password', {
					required: 'Password is required',
					minLength: {
						value: 8,
						message: 'Password must be at least 8 characters'
					}
					})}
					type="password"
					autoComplete="new-password"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					placeholder="Password"
				/>
				{errors.password && (
					<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
				)}
				</div>

				<div>
				<label className="block text-sm font-medium text-gray-700">
					Confirm Password
				</label>
				<input
					{...register('password_confirm', {
					required: 'Password confirmation is required',
					validate: (value) => value === password || 'Passwords must match'
					})}
					type="password"
					autoComplete="new-password"
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					placeholder="Confirm password"
				/>
				{errors.password_confirm && (
					<p className="mt-1 text-sm text-red-600">{errors.password_confirm.message}</p>
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
				{isLoading ? 'Creating account...' : 'Create account'}
				</button>
			</div>

			<p className="text-center text-sm text-gray-600">
				<Link
				to="/login"
				className="font-medium text-blue-600 hover:text-blue-500"
				>
				Sign in to your existing account
				</Link>
			</p>
			</form>
		</div>
		</div>
	);
};

export default RegisterPage;
