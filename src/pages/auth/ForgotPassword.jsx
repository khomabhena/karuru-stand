import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../../theme/colors.teal.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { AuthLayout } from '../../components/auth/AuthLayout.jsx'
import { AuthField } from '../../components/auth/AuthField.jsx'

export function ForgotPassword() {
	const { resetPassword } = useAuth()
	const [email, setEmail] = useState('')
	const [submitted, setSubmitted] = useState(false)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const onSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		const { data, error: resetError } = await resetPassword(email)

		if (resetError) {
			setError(resetError.message || 'Failed to send reset email. Please try again.')
			setLoading(false)
			return
		}

		setSubmitted(true)
		setLoading(false)
	}

	return (
		<AuthLayout
			title="Reset password"
			subtitle="We'll email you reset instructions"
			footer={
				<p className={`text-center text-sm ${theme.mutedText}`}>
					Remembered it?{' '}
					<Link to="/signin" className="text-teal-700 hover:underline">
						Back to sign in
					</Link>
				</p>
			}
		>
			{submitted ? (
				<div className="rounded-lg bg-teal-50 p-4 text-sm text-teal-700">
					<p className="mb-2">
						<strong>Check your email</strong>
					</p>
					<p>
						If an account exists for <strong>{email}</strong>, you'll receive
						password reset instructions shortly.
					</p>
				</div>
			) : (
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

					<button
						type="submit"
						disabled={loading}
						className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-opacity ${
							loading ? 'opacity-50 cursor-not-allowed' : ''
						} ${theme.btnPrimary}`}
					>
						{loading ? 'Sending...' : 'Send reset link'}
					</button>
				</form>
			)}
		</AuthLayout>
	)
}
