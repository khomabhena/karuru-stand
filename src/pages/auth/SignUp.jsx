import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { theme } from '../../theme/colors.teal.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { AuthLayout } from '../../components/auth/AuthLayout.jsx'
import { AuthField } from '../../components/auth/AuthField.jsx'

export function SignUp() {
	const { loginDemo } = useAuth()
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const onSubmit = e => {
		e.preventDefault()
		// Placeholder create-account; use demo login for now
		loginDemo()
		navigate('/app')
	}

	return (
		<AuthLayout title="Create account" subtitle="Start managing stands with Karuru" footer={(
			<p className={`text-center text-sm ${theme.mutedText}`}>
				Already have an account? <Link to="/signin" className="text-teal-700 hover:underline">Sign in</Link>
			</p>
		)}>
			<form onSubmit={onSubmit} className="space-y-3">
				<AuthField label="Full name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" name="name" autoComplete="name" />
				<AuthField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" name="email" autoComplete="email" />
				<AuthField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" name="new-password" autoComplete="new-password" />
				<button type="submit" className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}>Sign up</button>
			</form>
		</AuthLayout>
	)
}



