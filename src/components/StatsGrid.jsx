import React, { useState, useEffect } from 'react'
import { StatCard } from './StatCard.jsx'
import { getStands } from '../lib/api/stands.js'
import { getSales } from '../lib/api/sales.js'
import { getPayments } from '../lib/api/payments.js'
import { useRole } from '../hooks/useRole.js'

export function StatsGrid() {
	const { isAdmin, isAgencyManager, isAgencyStaff } = useRole()
	const isAgencyUser = isAgencyManager || isAgencyStaff
	
	const [stats, setStats] = useState({
		totalStands: 0,
		availableStands: 0,
		salesThisMonth: 0,
		revenueThisMonth: 0,
		outstandingBalance: 0,
		loading: true,
	})

	useEffect(() => {
		loadStats()
	}, [])

	const loadStats = async () => {
		try {
			// RLS policies will automatically filter sales and payments by agency
			// But stands are visible to all, so we need to handle that differently
			const [stands, sales, payments] = await Promise.all([
				isAdmin ? getStands() : Promise.resolve([]), // Only admins see all stands
				getSales(), // RLS filters by agency automatically
				getPayments(), // RLS filters by agency automatically
			])

			const now = new Date()
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

			// Calculate stats
			// For agency users, stands are not relevant (they don't manage stands)
			const totalStands = isAdmin ? stands.length : 0
			const availableStands = isAdmin ? stands.filter(s => s.status === 'available').length : 0

			// Sales and payments are already filtered by RLS for agency users
			const salesThisMonth = sales.filter(s => {
				const saleDate = new Date(s.sale_date)
				return saleDate >= startOfMonth
			}).length

			const revenueThisMonth = payments
				.filter(p => {
					const paymentDate = new Date(p.payment_date)
					return paymentDate >= startOfMonth
				})
				.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

			const outstandingBalance = sales.reduce(
				(sum, s) => sum + parseFloat(s.balance_remaining || 0),
				0
			)

			setStats({
				totalStands,
				availableStands,
				salesThisMonth,
				revenueThisMonth,
				outstandingBalance,
				loading: false,
			})
		} catch (err) {
			console.error('Error loading stats:', err)
			setStats(prev => ({ ...prev, loading: false }))
		}
	}

	if (stats.loading) {
		return (
			<section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
				{[1, 2, 3, 4].map(i => (
					<div key={i} className="rounded-lg border bg-white p-4">
						<div className="h-4 w-20 animate-pulse rounded bg-gray-200 mb-2"></div>
						<div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
					</div>
				))}
			</section>
		)
	}

	// For agency users, don't show stands card
	const cards = isAdmin ? [
		<StatCard
			key="stands"
			label="Total Stands"
			value={stats.totalStands.toString()}
			helper={`${stats.availableStands} available`}
			accent="accent2"
		/>,
		<StatCard
			key="sales"
			label={isAgencyUser ? (isAgencyStaff ? "My Sales (This Month)" : "Agency Sales (This Month)") : "Sales (This Month)"}
			value={stats.salesThisMonth.toString()}
			helper={isAgencyUser ? (isAgencyStaff ? "Your personal sales" : "Your agency's sales") : "New sales this month"}
			accent="accent2"
		/>,
		<StatCard
			key="revenue"
			label={isAgencyUser ? (isAgencyStaff ? "My Revenue" : "Agency Revenue") : "Revenue Collected"}
			value={`$${stats.revenueThisMonth.toLocaleString()}`}
			helper={isAgencyUser ? (isAgencyStaff ? "Your revenue this month" : "Your agency this month") : "This month"}
			accent="accent2"
		/>,
		<StatCard
			key="balance"
			label={isAgencyUser ? (isAgencyStaff ? "My Outstanding" : "Agency Outstanding") : "Outstanding Balance"}
			value={`$${stats.outstandingBalance.toLocaleString()}`}
			helper={isAgencyUser ? (isAgencyStaff ? "Your balance" : "Your agency's balance") : "Total remaining"}
			accent="error"
		/>
	] : [
		<StatCard
			key="sales"
			label={isAgencyStaff ? "My Sales (This Month)" : "Agency Sales (This Month)"}
			value={stats.salesThisMonth.toString()}
			helper={isAgencyStaff ? "Your personal sales" : "Your agency's sales"}
			accent="accent2"
		/>,
		<StatCard
			key="revenue"
			label={isAgencyStaff ? "My Revenue" : "Agency Revenue"}
			value={`$${stats.revenueThisMonth.toLocaleString()}`}
			helper={isAgencyStaff ? "Your revenue this month" : "Your agency this month"}
			accent="accent2"
		/>,
		<StatCard
			key="balance"
			label={isAgencyStaff ? "My Outstanding" : "Agency Outstanding"}
			value={`$${stats.outstandingBalance.toLocaleString()}`}
			helper={isAgencyStaff ? "Your balance" : "Your agency's balance"}
			accent="error"
		/>
	]

	return (
		<section className={`grid gap-3 sm:gap-4 ${isAdmin ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-3'}`}>
			{cards}
		</section>
	)
}



