import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { AuthLayout } from '../../components/auth/AuthLayout.jsx'
import { theme } from '../../theme/colors.teal.js'

export function ConfirmEmail() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
	const [error, setError] = useState('')

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				// Supabase processes email confirmation automatically when user clicks the link
				// Check if user is already authenticated (session exists after confirmation)
				const { data: { session }, error: sessionError } = await supabase.auth.getSession()
				
				if (session?.user) {
					// User is authenticated, email is confirmed
					setStatus('success')
					// Sign them out so they can sign in with their password
					await supabase.auth.signOut()
					setTimeout(() => {
						navigate('/signin')
					}, 3000)
					return
				}

				// Try to get token from URL hash (Supabase puts it in hash)
				const hashParams = new URLSearchParams(window.location.hash.substring(1))
				const accessToken = hashParams.get('access_token')
				const type = hashParams.get('type') || searchParams.get('type')
				
				// Also check query params (some configurations use query params)
				const queryToken = searchParams.get('token')

				if (accessToken || queryToken) {
					// Token exists, try to verify
					const token = queryToken || accessToken
					
					const { data, error: verifyError } = await supabase.auth.verifyOtp({
						token_hash: token,
						type: type || 'signup',
					})

					if (verifyError) {
						setStatus('error')
						setError(verifyError.message || 'Failed to verify email. The link may have expired.')
						return
					}

					// Success - sign out so they can sign in
					if (data?.session) {
						await supabase.auth.signOut()
					}
					setStatus('success')
					setTimeout(() => {
						navigate('/signin')
					}, 3000)
					return
				}

				// No token found - might be invalid link or already processed
				setStatus('error')
				setError('Invalid confirmation link. Please check your email and try again, or request a new confirmation email.')
			} catch (err) {
				console.error('Email verification error:', err)
				setStatus('error')
				setError('An unexpected error occurred. Please try again.')
			}
		}

		verifyEmail()
	}, [searchParams, navigate])

	if (status === 'verifying') {
		return (
			<AuthLayout
				title="Verifying email"
				subtitle="Please wait..."
			>
				<div className="flex items-center justify-center py-8">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-sm text-gray-600">Verifying your email address...</p>
					</div>
				</div>
			</AuthLayout>
		)
	}

	if (status === 'error') {
		return (
			<AuthLayout
				title="Verification failed"
				subtitle="Unable to verify your email"
				footer={
					<p className={`text-center text-sm ${theme.mutedText}`}>
						<a href="/signin" className="text-teal-700 hover:underline">
							Go to sign in
						</a>
					</p>
				}
			>
				<div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
					<p className="mb-2">
						<strong>Verification failed</strong>
					</p>
					<p>{error}</p>
				</div>
			</AuthLayout>
		)
	}

	return (
		<AuthLayout
			title="Email verified"
			subtitle="Your email has been confirmed"
			footer={
				<p className={`text-center text-sm ${theme.mutedText}`}>
					Redirecting to sign in...
				</p>
			}
		>
			<div className="rounded-lg bg-teal-50 p-4 text-sm text-teal-700">
				<p className="mb-2">
					<strong>Email verified successfully!</strong>
				</p>
				<p>
					Your account has been confirmed. You can now sign in.
				</p>
			</div>
		</AuthLayout>
	)
}

