import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../../theme/colors.teal.js'
import { AuthLayout } from '../../components/auth/AuthLayout.jsx'
import { AuthField } from '../../components/auth/AuthField.jsx'

export function ForgotPassword() {
	const [email, setEmail] = useState('')
	const [submitted, setSubmitted] = useState(false)

	const onSubmit = e => {
		e.preventDefault()
		// Placeholder action - in real app, trigger reset email
		setSubmitted(true)
	}

	return (
		<AuthLayout title="Reset password" subtitle="We'll email you reset instructions" footer={(
			<p className={`text-center text-sm ${theme.mutedText}`}>
				Remembered it? <Link to="/signin" className="text-teal-700 hover:underline">Back to sign in</Link>
			</p>
		)}>
			{submitted ? (
				<div className="rounded-lg bg-teal-50 p-3 text-sm text-teal-700">
					If an account exists for <strong>{email}</strong>, you’ll receive an email shortly.
				</div>
			) : (
				<form onSubmit={onSubmit} className="space-y-3">
					<AuthField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
					<button type="submit" className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}>Send reset link</button>
				</form>
			)}
		</AuthLayout>
	)
}



