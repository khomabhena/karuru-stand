import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { supabase } from '../../lib/supabase.js'

/**
 * ProtectedRoute component - redirects to login if not authenticated
 */
export function ProtectedRoute({ children }) {
	const { isAuthenticated, loading } = useAuth()
	const location = useLocation()
	const [hasSession, setHasSession] = useState(null)

	// Double-check session if auth context says not authenticated
	// This handles race conditions where sign-in just happened
	// Only check once, and do it immediately without blocking
	useEffect(() => {
		if (!loading && !isAuthenticated && hasSession === null) {
			// Check session immediately (non-blocking)
			supabase.auth.getSession().then(({ data: { session } }) => {
				setHasSession(!!session?.user)
			}).catch(() => {
				setHasSession(false)
			})
		}
	}, [loading, isAuthenticated, hasSession])

	// Show loading while checking
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

	// Check both auth context and direct session
	const authenticated = isAuthenticated || hasSession === true

	if (!authenticated) {
		// Redirect to sign in with return path
		return <Navigate to="/signin" state={{ from: location }} replace />
	}

	return children
}

