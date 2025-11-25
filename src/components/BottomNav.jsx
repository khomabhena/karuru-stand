import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useRole } from '../hooks/useRole.js'
import { theme } from '../theme/colors.teal.js'

export function BottomNav() {
	const location = useLocation()
	const { isAdmin, canCreateSales } = useRole()

	const navItems = [
		{
			path: '/app',
			label: 'Home',
			icon: (
				<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
			),
		},
		{
			path: '/stands',
			label: 'Stands',
			icon: (
				<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
				</svg>
			),
		},
		{
			path: '/sales',
			label: 'Sales',
			icon: (
				<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			),
		},
		{
			path: '/customers',
			label: 'Customers',
			icon: (
				<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			),
		},
		{
			path: '/agencies',
			label: 'Agencies',
			icon: (
				<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
				</svg>
			),
			show: isAdmin,
		},
	]

	const visibleItems = navItems.filter((item) => item.show !== false)

	return (
		<nav className={`fixed bottom-0 left-0 right-0 z-40 border-t bg-white sm:hidden ${theme.border}`}>
			<div className="flex items-center justify-around">
				{visibleItems.map((item) => {
					const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
					return (
						<Link
							key={item.path}
							to={item.path}
							className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
								isActive
									? 'text-teal-600'
									: 'text-gray-500 active:text-teal-600'
							}`}
						>
							{item.icon}
							<span className="text-xs font-medium">{item.label}</span>
						</Link>
					)
				})}
			</div>
		</nav>
	)
}

