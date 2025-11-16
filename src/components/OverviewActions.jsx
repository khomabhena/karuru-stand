import React from 'react'
import { theme } from '../theme/colors.teal.js'
import { ButtonLink } from './ui/ButtonLink.jsx'

export function OverviewActions() {
	return (
		<section className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
			<h2 className="text-base font-semibold tracking-tight sm:text-lg">Overview</h2>
			<div className="flex w-full items-center gap-2 sm:w-auto">
				<ButtonLink to="/stands/new" className="w-full sm:w-auto">Add Stand</ButtonLink>
				<ButtonLink to="/payments/new" className="w-full sm:w-auto">Record Payment</ButtonLink>
				<ButtonLink to="/sales/new" variant="primary" className="w-full sm:w-auto">New Sale</ButtonLink>
			</div>
		</section>
	)
}



