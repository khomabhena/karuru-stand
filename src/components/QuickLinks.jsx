import React from 'react'
import { theme } from '../theme/colors.teal.js'
import { ButtonLink } from './ui/ButtonLink.jsx'

export function QuickLinks() {
	return (
		<div className={`rounded-xl border shadow-sm p-4 ${theme.surface} ${theme.border}`}>
			<h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
			<nav className="grid gap-2 sm:grid-cols-2">
				<ButtonLink to="/stands" className="justify-center sm:justify-start px-3 py-2">Stands</ButtonLink>
				<ButtonLink to="/agencies" className="justify-center sm:justify-start px-3 py-2">Agencies</ButtonLink>
				<ButtonLink to="/customers" className="justify-center sm:justify-start px-3 py-2">Customers</ButtonLink>
				<ButtonLink to="/sales" className="justify-center sm:justify-start px-3 py-2">Sales</ButtonLink>
				<ButtonLink to="/payments" className="justify-center sm:justify-start px-3 py-2">Payments</ButtonLink>
				<ButtonLink to="/reports" className="justify-center sm:justify-start px-3 py-2">Reports</ButtonLink>
			</nav>
		</div>
	)
}



