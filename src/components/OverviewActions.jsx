import React from 'react'
import { theme } from '../theme/colors.teal.js'
import { ButtonLink } from './ui/ButtonLink.jsx'

export function OverviewActions() {
	return (
		<section className="hidden mb-4 flex-wrap items-center justify-between gap-3 sm:mb-6 sm:flex">
			<h2 className="text-base font-semibold tracking-tight sm:text-lg">Overview</h2>
			<div className="flex items-center gap-2">
				<ButtonLink to="/stands/new">Add Stand</ButtonLink>
				<ButtonLink to="/payments/new">Record Payment</ButtonLink>
				<ButtonLink to="/sales/new" variant="primary">New Sale</ButtonLink>
			</div>
		</section>
	)
}



