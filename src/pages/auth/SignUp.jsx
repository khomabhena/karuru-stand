import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { theme } from '../../theme/colors.teal.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { AuthLayout } from '../../components/auth/AuthLayout.jsx'
import { AuthField } from '../../components/auth/AuthField.jsx'
import { SEO } from '../../components/SEO.jsx'

export function SignUp() {
	const { signUp, resendConfirmation } = useAuth()
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)

	const onSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		// Validate password strength (minimum 6 characters)
		if (password.length < 6) {
			setError('Password must be at least 6 characters long.')
			setLoading(false)
			return
		}

		const { data, error: signUpError } = await signUp(email, password, name)

		if (signUpError) {
			setError(signUpError.message || 'Failed to create account. Please try again.')
			setLoading(false)
			return
		}

		// Check if email confirmation is required
		// If user is null, it means email confirmation is enabled
		// If user exists and email_confirmed_at is null, confirmation is still needed
		const needsConfirmation = !data?.user || (data?.user && !data.user.email_confirmed_at)

		setNeedsEmailConfirmation(needsConfirmation)
		setSuccess(true)
		setLoading(false)

		// Only auto-redirect if email confirmation is not required
		if (!needsConfirmation) {
			setTimeout(() => {
				navigate('/signin')
			}, 2000)
		}
	}

	const handleResendEmail = async () => {
		setError('')
		setLoading(true)
		const { error: resendError } = await resendConfirmation(email)
		if (resendError) {
			setError(resendError.message || 'Failed to resend confirmation email. Please try again.')
		} else {
			setError('')
			alert('Confirmation email sent! Please check your inbox.')
		}
		setLoading(false)
	}

	if (success) {
		return (
			<AuthLayout
				title="Account created"
				subtitle="Your account has been created successfully"
				footer={
					<p className={`text-center text-sm ${theme.mutedText}`}>
						{needsEmailConfirmation ? (
							<>
								Didn't receive the email?{' '}
								<button
									type="button"
									onClick={handleResendEmail}
									disabled={loading}
									className="text-teal-700 hover:underline disabled:opacity-50"
								>
									Resend confirmation email
								</button>
							</>
						) : (
							'Redirecting to sign in...'
						)}
					</p>
				}
			>
				<div className="rounded-lg bg-teal-50 p-4 text-sm text-teal-700">
					<p className="mb-2">
						<strong>Account created!</strong>
					</p>
					{needsEmailConfirmation ? (
						<>
							<p className="mb-3">
								We've sent a confirmation email to <strong>{email}</strong>
							</p>
							<p>
								Please check your email and click the confirmation link to verify your account, then you can sign in.
							</p>
						</>
					) : (
						<p>
							You can now sign in with your credentials.
						</p>
					)}
				</div>
			</AuthLayout>
		)
	}

	return (
		<>
			<SEO 
				title="Sign Up"
				description="Create your Karuru Stand Management account to start tracking stands, sales, customers, and payments."
				url="https://karuru-stand.vercel.app/signup"
			/>
			<AuthLayout
				title="Create account"
				subtitle="Start managing stands with Karuru"
				footer={
				<p className={`text-center text-sm ${theme.mutedText}`}>
					Already have an account?{' '}
					<Link to="/signin" className="text-teal-700 hover:underline">
						Sign in
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
					label="Full name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Jane Doe"
					name="name"
					autoComplete="name"
					required
					disabled={loading}
				/>

				<AuthField
					label="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					name="email"
					autoComplete="email"
					required
					disabled={loading}
				/>

				<AuthField
					label="Password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
					name="new-password"
					autoComplete="new-password"
					required
					disabled={loading}
				/>

				<p className="text-xs text-gray-500">
					Password must be at least 6 characters long.
				</p>

				<button
					type="submit"
					disabled={loading}
					className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-opacity ${
						loading ? 'opacity-50 cursor-not-allowed' : ''
					} ${theme.btnPrimary}`}
				>
					{loading ? 'Creating account...' : 'Sign up'}
				</button>
			</form>
		</AuthLayout>
		</>
	)
}
