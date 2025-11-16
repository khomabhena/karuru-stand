import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { theme } from '../../theme/colors.teal.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { AuthLayout } from '../../components/auth/AuthLayout.jsx'
import { AuthField } from '../../components/auth/AuthField.jsx'

export function SignIn() {
	const { loginDemo } = useAuth()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const onSubmit = e => {
		e.preventDefault()
		// For now, use the demo login and go to dashboard
		loginDemo()
		navigate('/app')
	}

	return (
		<AuthLayout title="Sign in" subtitle="Welcome back to Karuru" footer={(
			<p className={`text-center text-sm ${theme.mutedText}`}>
				Don't have an account? <Link to="/signup" className="text-teal-700 hover:underline">Sign up</Link>
			</p>
		)}>
			<form onSubmit={onSubmit} className="space-y-3">
				<AuthField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
				<AuthField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
				<div className="flex items-center justify-between">
					<Link to="/forgot-password" className="text-sm text-teal-700 hover:underline">Forgot password?</Link>
				</div>
				<button type="submit" className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}>Sign in</button>
			</form>
		</AuthLayout>
	)
}



