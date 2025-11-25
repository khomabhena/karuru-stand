import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../theme/colors.teal.js'
import { getSales } from '../lib/api/sales.js'
import { getPayments } from '../lib/api/payments.js'
import { useRole } from '../hooks/useRole.js'

export function RecentActivity() {
	const { isAgencyManager, isAgencyStaff } = useRole()
	const isAgencyUser = isAgencyManager || isAgencyStaff
	const [activities, setActivities] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadActivities()
	}, [])

	const loadActivities = async () => {
		try {
			setLoading(true)
			const [sales, payments] = await Promise.all([
				getSales(),
				getPayments(),
			])

			// Combine and sort by date
			const allActivities = [
				...(sales || []).slice(0, 5).map(sale => {
					const saleDate = sale.created_at ? new Date(sale.created_at) : new Date()
					return {
						type: 'sale',
						id: sale.id,
						date: saleDate,
						description: `Sale created • ${sale.stands?.stand_number || 'N/A'} to ${sale.customers ? `${sale.customers.first_name} ${sale.customers.last_name}` : 'N/A'}`,
						subtitle: sale.agencies?.name || 'Unknown Agency',
						amount: sale.deposit_amount,
						color: 'success',
					}
				}),
				...(payments || []).slice(0, 5).map(payment => {
					const paymentDate = payment.payment_date ? new Date(payment.payment_date) : new Date()
					return {
						type: 'payment',
						id: payment.id,
						date: paymentDate,
						description: `Payment recorded • Contract #${payment.sales?.contract_number || 'N/A'}`,
						subtitle: payment.user_profiles?.full_name || 'Unknown',
						amount: payment.amount,
						color: 'info',
					}
				}),
			]
				.filter(activity => activity.date && !isNaN(activity.date.getTime())) // Filter out invalid dates
				.sort((a, b) => b.date - a.date)
				.slice(0, 5)

			setActivities(allActivities)
		} catch (err) {
			console.error('Error loading activities:', err)
			setActivities([]) // Set empty array on error
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (date) => {
		const now = new Date()
		const diffTime = now - date
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

		if (diffDays === 0) {
			return 'Today, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
		} else if (diffDays === 1) {
			return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
		} else if (diffDays < 7) {
			return `${diffDays} days ago`
		} else {
			return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
		}
	}

	return (
		<div className={`rounded-xl border shadow-sm p-4 lg:col-span-2 ${theme.surface} ${theme.border}`}>
			<div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
				<h3 className="text-sm font-semibold">
					{isAgencyUser ? (isAgencyStaff ? 'My Activity' : 'Agency Activity') : 'Recent Activity'}
				</h3>
				<Link
					to="/sales"
					className={`text-sm inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-colors ${theme.btnGhost} w-full sm:w-auto`}
				>
					View all
				</Link>
			</div>
			{loading ? (
				<div className="space-y-3">
					{[1, 2, 3].map(i => (
						<div key={i} className={`rounded-lg border p-3 ${theme.border}`}>
							<div className="h-4 w-48 animate-pulse rounded bg-gray-200 mb-2"></div>
							<div className="h-3 w-32 animate-pulse rounded bg-gray-200"></div>
						</div>
					))}
				</div>
			) : activities.length === 0 ? (
				<p className={`text-sm ${theme.mutedText} py-4 text-center`}>No recent activity</p>
			) : (
				<ul className="space-y-3">
					{activities.map((activity) => (
						<li key={`${activity.type}-${activity.id}`} className={`flex items-center justify-between rounded-lg border p-3 ${theme.border}`}>
							<div>
								<p className="text-sm font-medium">{activity.description}</p>
								<p className={`text-xs ${theme.mutedText}`}>
									{activity.subtitle} • {formatDate(activity.date)}
								</p>
							</div>
							{activity.amount && (
								<span className={`rounded-full px-2 py-1 text-xs ${
									activity.color === 'success' ? theme.pill.success :
									activity.color === 'info' ? theme.pill.info :
									activity.color === 'warning' ? theme.pill.warning :
									theme.pill.info
								}`}>
									${parseFloat(activity.amount).toLocaleString()}
								</span>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}



