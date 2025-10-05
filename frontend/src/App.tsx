import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import LeadFormPage from './pages/LeadFormPage';
import LeadDetailPage from './pages/LeadDetailPage';

function App() {
	return (
		<AuthProvider>
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route
					path="/dashboard"
					element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
					}
				/>
				<Route
					path="/leads/new"
					element={
					<ProtectedRoute>
						<LeadFormPage />
					</ProtectedRoute>
					}
				/>
				<Route
					path="/leads/:id"
					element={
					<ProtectedRoute>
						<LeadDetailPage />
					</ProtectedRoute>
					}
				/>
				<Route 
					path="/" 
					element={<Navigate to="/dashboard" 
					replace />} 
				/>
			</Routes>
		</Router>
		</AuthProvider>
	);
}

export default App;