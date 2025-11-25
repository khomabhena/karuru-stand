import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { theme } from '../../theme/colors.teal.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { AuthLayout } from '../../components/auth/AuthLayout.jsx'
import { AuthField } from '../../components/auth/AuthField.jsx'

export function SignIn() {
	const { signIn, isAuthenticated } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [signInSuccess, setSignInSuccess] = useState(false)

	// Navigate when authentication is confirmed
	useEffect(() => {
		if (isAuthenticated) {
			const from = location.state?.from?.pathname || '/app'
			navigate(from, { replace: true })
			setSignInSuccess(false)
		}
	}, [isAuthenticated, navigate, location])

	const onSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			const { data, error: signInError } = await signIn(email, password)

			if (signInError) {
				setError(signInError.message || 'Failed to sign in. Please check your credentials.')
				setLoading(false)
				return
			}

			if (!data?.user) {
				setError('Sign in failed. Please try again.')
				setLoading(false)
				return
			}

			// Mark sign-in as successful - useEffect will handle navigation
			setSignInSuccess(true)
			setLoading(false)
		} catch (err) {
			console.error('Unexpected sign-in error:', err)
			setError(err.message || 'An unexpected error occurred. Please try again.')
			setLoading(false)
		}
	}

	return (
		<AuthLayout
			title="Sign in"
			subtitle="Welcome back to Karuru"
			footer={
				<p className={`text-center text-sm ${theme.mutedText}`}>
					Don't have an account?{' '}
					<Link to="/signup" className="text-teal-700 hover:underline">
						Sign up
					</Link>
				</p>
			}
		>
			<form onSubmit={onSubmit} className="space-y-3">
				{error && (
					<div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				<AuthField
					label="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					autoComplete="email"
					required
					disabled={loading}
				/>

				<div>
					<label className="text-sm font-medium">Password</label>
					<div className="relative mt-1">
						<input
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							autoComplete="current-password"
							required
							disabled={loading}
							className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							disabled={loading}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{showPassword ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
									<path
										fillRule="evenodd"
										d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
										clipRule="evenodd"
									/>
									<path d="M2.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14z" />
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
									<path
										fillRule="evenodd"
										d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<Link
						to="/forgot-password"
						className="text-sm text-teal-700 hover:underline"
					>
						Forgot password?
					</Link>
				</div>

				<button
					type="submit"
					disabled={loading}
					className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-opacity ${
						loading ? 'opacity-50 cursor-not-allowed' : ''
					} ${theme.btnPrimary}`}
				>
					{loading ? 'Signing in...' : 'Sign in'}
				</button>
			</form>
		</AuthLayout>
	)
}
