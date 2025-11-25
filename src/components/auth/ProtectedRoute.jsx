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
	// Also re-checks on logout to ensure session is cleared
	useEffect(() => {
		if (!loading && !isAuthenticated) {
			// Always check session when not authenticated (handles logout)
			supabase.auth.getSession().then(({ data: { session } }) => {
				setHasSession(!!session?.user)
			}).catch(() => {
				setHasSession(false)
			})
		} else if (isAuthenticated) {
			// Reset hasSession when authenticated (from context)
			setHasSession(true)
		}
	}, [loading, isAuthenticated])

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

	// If explicitly not authenticated (after loading), redirect immediately
	// This handles logout cases where user state is cleared
	// isAuthenticated takes precedence - if it's false, we redirect regardless of hasSession
	if (!loading && !isAuthenticated) {
		// Double-check session only if we haven't checked yet (for sign-in race conditions)
		if (hasSession === null) {
			// Still checking session, show loading
			return (
				<div className="flex min-h-screen items-center justify-center">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading...</p>
					</div>
				</div>
			)
		}
		// No session confirmed, redirect immediately (logout case)
		return <Navigate to="/signin" state={{ from: location }} replace />
	}

	// If authenticated (from context), allow access
	// Also allow if we found a session during initial load (before context is ready)
	if (isAuthenticated || (hasSession === true && loading)) {
		return children
	}

	// Still loading, show loading state
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
				<p className="text-gray-600">Loading...</p>
			</div>
		</div>
	)
}

