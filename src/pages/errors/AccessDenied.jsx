import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import { theme } from '../../theme/colors.teal.js'
import { SEO } from '../../components/SEO.jsx'

export function AccessDenied() {
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()

	return (
		<>
			<SEO 
				title="Access Denied"
				description="You don't have permission to access this page."
			/>
			<div className={`min-h-screen ${theme.appBg} flex items-center justify-center p-4`}>
				<div className="w-full max-w-md text-center">
					{/* Icon */}
					<div className="mb-6 flex justify-center">
						<div className="rounded-full bg-red-100 p-4">
							<svg
								className="h-16 w-16 text-red-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
					</div>

					{/* Error Code */}
					<h1 className="mb-2 text-6xl font-bold text-gray-900">403</h1>
					
					{/* Title */}
					<h2 className="mb-3 text-2xl font-semibold text-gray-800">Access Denied</h2>
					
					{/* Message */}
					<p className={`mb-8 text-base ${theme.mutedText}`}>
						You don't have permission to access this page. This may be because your account doesn't have the required role or permissions.
					</p>

					{/* Action Buttons */}
					<div className="space-y-3">
						{isAuthenticated ? (
							<>
								<button
									onClick={() => navigate('/app')}
									className={`w-full rounded-lg px-6 py-3 text-base font-medium transition-colors ${theme.btnPrimary}`}
								>
									Return to Dashboard
								</button>
								<button
									onClick={() => navigate(-1)}
									className={`w-full rounded-lg border px-6 py-3 text-base font-medium transition-colors ${theme.border} ${theme.btnGhost}`}
								>
									Go Back
								</button>
							</>
						) : (
							<>
								<Link
									to="/signin"
									className={`block w-full rounded-lg px-6 py-3 text-center text-base font-medium transition-colors ${theme.btnPrimary}`}
								>
									Sign In
								</Link>
								<Link
									to="/signup"
									className={`block w-full rounded-lg border px-6 py-3 text-center text-base font-medium transition-colors ${theme.border} ${theme.btnGhost}`}
								>
									Create an Account
								</Link>
							</>
						)}
					</div>

					{/* Help Text */}
					<p className={`mt-8 text-sm ${theme.mutedText}`}>
						If you believe this is an error, please contact your administrator.
					</p>
				</div>
			</div>
		</>
	)
}

