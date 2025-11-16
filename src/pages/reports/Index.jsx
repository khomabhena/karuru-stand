import React, { useMemo } from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { theme } from '../../theme/colors.teal.js'
import { Card } from '../../components/ui/Card.jsx'
import { sales } from '../../data/sales.js'
import { payments } from '../../data/payments.js'
import { stands } from '../../data/stands.js'

export default function ReportsPage() {
	const summary = useMemo(() => {
		const revenue = payments.reduce((acc, p) => acc + p.amount, 0)
		const outstanding = sales.reduce((acc, s) => acc + (s.balance || 0), 0)
		const availableStands = stands.filter(s => s.status === 'Available').length
		return { revenue, outstanding, availableStands }
	}, [])

	return (
		<PageShell title="Reports">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card title="Revenue Collected (dummy)">
					<p className="text-2xl font-semibold text-teal-700">${summary.revenue.toLocaleString()}</p>
					<p className={`text-sm ${theme.mutedText}`}>This is a computed sum of dummy payments</p>
				</Card>
				<Card title="Outstanding Balance (dummy)">
					<p className="text-2xl font-semibold text-amber-700">${summary.outstanding.toLocaleString()}</p>
					<p className={`text-sm ${theme.mutedText}`}>Sum of sales balances</p>
				</Card>
				<Card title="Available Stands">
					<p className="text-2xl font-semibold text-teal-700">{summary.availableStands}</p>
					<p className={`text-sm ${theme.mutedText}`}>From current dummy stands dataset</p>
				</Card>
			</div>

			<div className="mt-4 grid gap-4 lg:grid-cols-2">
				<Card title="Collections by Method">
					<ul className="text-sm">
						{Object.entries(payments.reduce((acc, p) => ((acc[p.method] = (acc[p.method] || 0) + p.amount), acc), {})).map(
							([method, amount]) => (
								<li key={method} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
									<span>{method}</span>
									<span className="font-medium">${amount.toLocaleString()}</span>
								</li>
							)
						)}
					</ul>
				</Card>
				<Card title="Balances by Status">
					<ul className="text-sm">
						{Object.entries(sales.reduce((acc, s) => ((acc[s.status] = (acc[s.status] || 0) + (s.balance || 0)), acc), {})).map(
							([status, amount]) => (
								<li key={status} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
									<span>{status}</span>
									<span className="font-medium">${amount.toLocaleString()}</span>
								</li>
							)
						)}
					</ul>
				</Card>
			</div>
		</PageShell>
	)
}


