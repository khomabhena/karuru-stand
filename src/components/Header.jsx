import React from 'react'
import { theme } from '../theme/colors.teal.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export function Header({ title, subtitle }) {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const initials =
		user && user.name
			? user.name
					.split(' ')
					.map(p => p[0])
					.slice(0, 2)
					.join('')
					.toUpperCase()
			: 'G'

	return (
		<header className={`sticky top-0 z-10 ${theme.primaryBg} text-white`}>
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
				<div>
					<h1 className="text-xl font-semibold tracking-tight">{title}</h1>
					{subtitle ? <p className="mt-0.5 text-sm text-white/80">{subtitle}</p> : null}
				</div>
				<div className="flex items-center gap-2">
					<div className="hidden text-right md:block">
						<p className="text-xs uppercase tracking-wide text-white/70">Signed in</p>
						<p className="text-sm font-medium">
							{user ? user.name : 'Guest'}
							{user?.email ? <span className="text-white/70"> • {user.email}</span> : null}
						</p>
					</div>
					<div className="h-9 w-9 select-none rounded-full bg-white/20 text-center leading-9 font-semibold">
						{initials}
					</div>
					<button
						onClick={() => {
							logout()
							navigate('/signin')
						}}
						className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors text-white hover:bg-white/10"
					>
						Logout
					</button>
				</div>
			</div>
		</header>
	)
}


