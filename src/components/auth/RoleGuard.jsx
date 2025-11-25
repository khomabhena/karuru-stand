import { Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { useRole } from '../../hooks/useRole'

/**
 * RoleGuard component - restricts access based on user role
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {string|string[]} props.allowedRoles - Single role or array of allowed roles
 * @param {React.ReactNode} props.fallback - Optional fallback component (defaults to 403 page)
 */
export function RoleGuard({ children, allowedRoles, fallback }) {
	const { isAuthenticated, loading } = useAuth()
	const { hasRole, hasAnyRole } = useRole()

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		return <Navigate to="/signin" replace />
	}

	// Check if user has required role
	const isAuthorized = Array.isArray(allowedRoles)
		? hasAnyRole(allowedRoles)
		: hasRole(allowedRoles)

	if (!isAuthorized) {
		if (fallback) {
			return fallback
		}

		// Default 403 page
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<h1 className="mb-2 text-4xl font-bold text-gray-900">403</h1>
					<p className="mb-4 text-gray-600">Access Denied</p>
					<p className="text-sm text-gray-500">
						You don't have permission to access this page.
					</p>
				</div>
			</div>
		)
	}

	return children
}

