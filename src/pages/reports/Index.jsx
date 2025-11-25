import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { theme } from '../../theme/colors.teal.js'
import { Card } from '../../components/ui/Card.jsx'
import { getSales } from '../../lib/api/sales.js'
import { getPayments } from '../../lib/api/payments.js'
import { getStands } from '../../lib/api/stands.js'

export default function ReportsPage() {
	const navigate = useNavigate()
	const [sales, setSales] = useState([])
	const [payments, setPayments] = useState([])
	const [stands, setStands] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		try {
			setLoading(true)
			const [salesData, paymentsData, standsData] = await Promise.all([
				getSales(),
				getPayments(),
				getStands()
			])
			setSales(salesData)
			setPayments(paymentsData)
			setStands(standsData)
			setError('')
		} catch (err) {
			console.error('Error loading report data:', err)
			setError(err.message || 'Failed to load report data')
		} finally {
			setLoading(false)
		}
	}

	const summary = useMemo(() => {
		const revenue = payments.reduce((acc, p) => acc + parseFloat(p.amount || 0), 0)
		const outstanding = sales.reduce((acc, s) => acc + parseFloat(s.balance_remaining || 0), 0)
		const availableStands = stands.filter(s => s.status === 'available').length
		return { revenue, outstanding, availableStands }
	}, [sales, payments, stands])

	const paymentsByMethod = useMemo(() => {
		return payments.reduce((acc, p) => {
			const method = p.payment_method || 'unknown'
			acc[method] = (acc[method] || 0) + parseFloat(p.amount || 0)
			return acc
		}, {})
	}, [payments])

	const balancesByStatus = useMemo(() => {
		return sales.reduce((acc, s) => {
			const status = s.status || 'unknown'
			acc[status] = (acc[status] || 0) + parseFloat(s.balance_remaining || 0)
			return acc
		}, {})
	}, [sales])

	const formatPaymentMethod = (method) => {
		if (!method) return 'Unknown'
		return method.split('_').map(word => 
			word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ')
	}

	const formatStatus = (status) => {
		if (!status) return 'Unknown'
		return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
	}

	return (
		<PageShell title="Reports">
			<div className="mb-4">
				<p className="text-sm text-gray-600">
					View detailed reports and analytics for your business
				</p>
			</div>

			{error && (
				<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{/* Report Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card title="Sales Report">
					<p className="mb-4 text-sm text-gray-600">
						Detailed sales report with filters and export options
					</p>
					<button
						onClick={() => navigate('/reports/sales')}
						className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}
					>
						View Sales Report
					</button>
				</Card>

				<Card title="Payment Report">
					<p className="mb-4 text-sm text-gray-600">
						Payment history with date range filters and export
					</p>
					<button
						onClick={() => navigate('/reports/payments')}
						className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}
					>
						View Payment Report
					</button>
				</Card>

				<Card title="Summary Statistics">
					<p className="mb-4 text-sm text-gray-600">
						Quick overview of key metrics
					</p>
					<button
						onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
						className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}
					>
						View Summary
					</button>
				</Card>
			</div>

			{loading ? (
				<div className="mt-4 flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading summary...</p>
					</div>
				</div>
			) : (
				<>
					<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<Card title="Revenue Collected">
							<p className="text-2xl font-semibold text-teal-700">${summary.revenue.toLocaleString()}</p>
							<p className={`text-sm ${theme.mutedText}`}>Total from all payments</p>
						</Card>
						<Card title="Outstanding Balance">
							<p className="text-2xl font-semibold text-amber-700">${summary.outstanding.toLocaleString()}</p>
							<p className={`text-sm ${theme.mutedText}`}>Sum of sales balances</p>
						</Card>
						<Card title="Available Stands">
							<p className="text-2xl font-semibold text-teal-700">{summary.availableStands}</p>
							<p className={`text-sm ${theme.mutedText}`}>Stands ready for sale</p>
						</Card>
					</div>

					<div className="mt-4 grid gap-4 lg:grid-cols-2">
						<Card title="Collections by Method">
							{Object.keys(paymentsByMethod).length > 0 ? (
								<ul className="text-sm">
									{Object.entries(paymentsByMethod).map(([method, amount]) => (
										<li key={method} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
											<span>{formatPaymentMethod(method)}</span>
											<span className="font-medium">${amount.toLocaleString()}</span>
										</li>
									))}
								</ul>
							) : (
								<p className={`text-sm ${theme.mutedText}`}>No payments recorded yet</p>
							)}
						</Card>
						<Card title="Balances by Status">
							{Object.keys(balancesByStatus).length > 0 ? (
								<ul className="text-sm">
									{Object.entries(balancesByStatus).map(([status, amount]) => (
										<li key={status} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
											<span>{formatStatus(status)}</span>
											<span className="font-medium">${amount.toLocaleString()}</span>
										</li>
									))}
								</ul>
							) : (
								<p className={`text-sm ${theme.mutedText}`}>No sales data available</p>
							)}
						</Card>
					</div>
				</>
			)}
		</PageShell>
	)
}


