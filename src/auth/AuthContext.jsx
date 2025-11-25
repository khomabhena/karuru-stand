import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [profile, setProfile] = useState(null)
	const [loading, setLoading] = useState(true)

	// Fetch user profile from database
	const fetchProfile = async (userId) => {
		try {
			console.log('Fetching profile for user:', userId)
			
			// Check if Supabase is configured
			if (!supabase) {
				console.error('Supabase client not initialized')
				setProfile(null)
				return null
			}

			// Try fetching profile without timeout first (timeout can cause issues)
			// Include agency information if user has an agency
			const { data, error } = await supabase
				.from('user_profiles')
				.select(`
					*,
					agencies (
						id,
						name
					)
				`)
				.eq('id', userId)
				.single()

			if (error) {
				console.error('Error fetching profile:', error)
				
				// If profile doesn't exist (PGRST116), that's okay
				if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
					console.warn('Profile not found for user:', userId)
					console.warn('User may need to be created in user_profiles table')
					setProfile(null)
					return null
				}
				
				// For RLS errors, log but don't throw
				if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('policy')) {
					console.error('RLS policy error - user may not have access:', error)
					setProfile(null)
					return null
				}
				
				// For network errors, log but don't block sign-in
				if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
					console.warn('Network error fetching profile - user can still sign in:', error.message)
					console.warn('Profile will be fetched on next page load')
					setProfile(null)
					return null
				}
				
				// For other errors, still don't throw - just log
				console.error('Unexpected error fetching profile:', error)
				setProfile(null)
				return null
			}

			console.log('Profile fetched successfully:', data)
			setProfile(data)
			return data
		} catch (error) {
			console.error('Exception fetching profile:', error)
			// Check if it's a network error
			if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
				console.warn('Network error - profile fetch failed, but sign-in can continue')
				console.warn('This might be a CORS issue or network connectivity problem')
				console.warn('Check your Supabase URL and network connection')
			}
			// Never throw - always return null so app can continue
			setProfile(null)
			return null
		}
	}

	// Initialize auth state
	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null)
			if (session?.user) {
				fetchProfile(session.user.id)
			} else {
				setProfile(null)
			}
			setLoading(false)
		})

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user ?? null)
			setLoading(false)
			// Fetch profile in background - don't block auth state update
			if (session?.user) {
				fetchProfile(session.user.id).catch((err) => {
					console.warn('Profile fetch failed in auth state change:', err)
				})
			} else {
				setProfile(null)
			}
		})

		return () => subscription.unsubscribe()
	}, [])

	// Sign in with email and password
	const signIn = async (email, password) => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})

			if (error) throw error

			// Fetch profile, but don't block sign-in if it fails
			if (data.user) {
				// Don't await - let it happen in background
				fetchProfile(data.user.id).catch((err) => {
					console.warn('Profile fetch failed, but sign-in succeeded:', err)
				})
			}

			return { data, error: null }
		} catch (error) {
			console.error('Sign in error:', error)
			return { data: null, error }
		}
	}

	// Sign up with email and password
	const signUp = async (email, password, fullName) => {
		try {
			// Get the current origin for email redirect
			const redirectTo = `${window.location.origin}/auth/confirm`
			
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: redirectTo,
					data: {
						full_name: fullName,
					},
				},
			})

			if (error) throw error

			// Note: User profile will be created automatically by trigger
			// But we need to update it with role (default is agency_staff)
			// Admin should manually update roles in database

			return { data, error: null }
		} catch (error) {
			console.error('Sign up error:', error)
			return { data: null, error }
		}
	}

	// Resend email confirmation
	const resendConfirmation = async (email) => {
		try {
			const { error } = await supabase.auth.resend({
				type: 'signup',
				email: email,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/confirm`,
				},
			})

			if (error) throw error
			return { error: null }
		} catch (error) {
			console.error('Resend confirmation error:', error)
			return { error }
		}
	}

	// Sign out
	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut()
			if (error) throw error
			setUser(null)
			setProfile(null)
			return { error: null }
		} catch (error) {
			console.error('Sign out error:', error)
			return { error }
		}
	}

	// Reset password
	const resetPassword = async (email) => {
		try {
			const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`,
			})

			if (error) throw error
			return { data, error: null }
		} catch (error) {
			console.error('Reset password error:', error)
			return { data: null, error }
		}
	}

	// Update password
	const updatePassword = async (newPassword) => {
		try {
			const { data, error } = await supabase.auth.updateUser({
				password: newPassword,
			})

			if (error) throw error
			return { data, error: null }
		} catch (error) {
			console.error('Update password error:', error)
			return { data: null, error }
		}
	}

	// Refresh profile (useful after role updates)
	const refreshProfile = async () => {
		if (user?.id) {
			await fetchProfile(user.id)
		}
	}

	const value = useMemo(
		() => ({
			user,
			profile,
			loading,
			signIn,
			signUp,
			resendConfirmation,
			signOut,
			resetPassword,
			updatePassword,
			refreshProfile,
			isAuthenticated: !!user,
		}),
		[user, profile, loading]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
