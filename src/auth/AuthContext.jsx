import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)

	// load from localStorage
	useEffect(() => {
		try {
			const raw = localStorage.getItem('auth:user')
			if (raw) setUser(JSON.parse(raw))
		} catch {}
	}, [])

	// persist to localStorage
	useEffect(() => {
		try {
			if (user) localStorage.setItem('auth:user', JSON.stringify(user))
			else localStorage.removeItem('auth:user')
		} catch {}
	}, [user])

	const loginDemo = () => {
		setUser({
			id: 'demo-user',
			name: 'Demo User',
			email: 'demo@karuru.app',
			role: 'admin'
		})
	}

	const logout = () => setUser(null)

	const value = useMemo(() => ({ user, loginDemo, logout }), [user])

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}


