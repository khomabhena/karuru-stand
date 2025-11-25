import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { getSale } from '../../lib/api/sales.js'
import { getPaymentsBySale } from '../../lib/api/payments.js'
import { useRole } from '../../hooks/useRole.js'
import { theme } from '../../theme/colors.teal.js'

export default function SaleView() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { canCreateSales, isAdmin } = useRole()
	const [sale, setSale] = useState(null)
	const [payments, setPayments] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		loadSale()
		loadPayments()
	}, [id])

	const loadSale = async () => {
		try {
			setLoading(true)
			const data = await getSale(id)
			setSale(data)
			setError('')
		} catch (err) {
			console.error('Error loading sale:', err)
			setError(err.message || 'Failed to load sale')
		} finally {
			setLoading(false)
		}
	}

	const loadPayments = async () => {
		try {
			const data = await getPaymentsBySale(id)
			setPayments(data)
		} catch (err) {
			console.error('Error loading payments:', err)
		}
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'completed': return 'success'
			case 'in_progress': return 'warning'
			case 'pending': return 'neutral'
			case 'cancelled': return 'error'
			default: return 'neutral'
		}
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	const formatCurrency = (amount) => {
		return `$${parseFloat(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
	}

	const formatPaymentMethod = (method) => {
		if (!method) return 'N/A'
		return method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
	}

	if (loading) {
		return (
			<PageShell title="Sale Details">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading sale...</p>
					</div>
				</div>
			</PageShell>
		)
	}

	if (error || !sale) {
		return (
			<PageShell title="Sale Details">
				<Card title="Error">
					<div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{error || 'Sale not found'}
					</div>
					<button
						onClick={() => navigate('/sales')}
						className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 active:bg-gray-100 sm:hover:bg-gray-50"
					>
						Back to Sales
					</button>
				</Card>
			</PageShell>
		)
	}

	const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
	const progressPercentage = sale.total_price > 0 ? (totalPaid / parseFloat(sale.total_price)) * 100 : 0
	const customerName = sale.customers ? `${sale.customers.first_name} ${sale.customers.last_name}` : 'N/A'

	const paymentColumns = [
		{ key: 'payment_date', header: 'Date' },
		{ key: 'amount', header: 'Amount' },
		{ key: 'payment_method', header: 'Method' },
		{ key: 'reference_number', header: 'Reference' },
		{ key: 'recorded_by', header: 'Recorded By' },
	]

	const paymentRows = payments.map((payment) => ({
		...payment,
		payment_date: formatDate(payment.payment_date),
		amount: formatCurrency(payment.amount),
		payment_method: formatPaymentMethod(payment.payment_method),
		reference_number: payment.reference_number || 'N/A',
		recorded_by: payment.user_profiles?.full_name || 'Unknown',
	}))

	return (
		<PageShell title="Sale Details">
			<Card title={`Contract: ${sale.contract_number || 'N/A'}`}>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Badge color={getStatusColor(sale.status)}>
							{sale.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
						</Badge>
						{canCreateSales && (
							<button
								onClick={() => navigate(`/payments/new?sale_id=${sale.id}`)}
								className={`rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}
							>
								Record Payment
							</button>
						)}
					</div>

					{/* Payment Progress */}
					<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
						<div className="mb-2 flex items-center justify-between text-sm">
							<span className="font-medium text-gray-700">Payment Progress</span>
							<span className="text-gray-600">{progressPercentage.toFixed(1)}%</span>
						</div>
						<div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
							<div
								className="h-full bg-teal-600 transition-all"
								style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
							/>
						</div>
						<div className="grid grid-cols-3 gap-4 text-sm">
							<div>
								<div className="text-xs text-gray-500">Total Price</div>
								<div className="font-semibold text-gray-900">{formatCurrency(sale.total_price)}</div>
							</div>
							<div>
								<div className="text-xs text-gray-500">Paid</div>
								<div className="font-semibold text-teal-600">{formatCurrency(totalPaid)}</div>
							</div>
							<div>
								<div className="text-xs text-gray-500">Balance</div>
								<div className="font-semibold text-gray-900">{formatCurrency(sale.balance_remaining)}</div>
							</div>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Sale Date
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{formatDate(sale.sale_date)}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Payment Plan
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{sale.payment_plan || 'N/A'}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Deposit Amount
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{formatCurrency(sale.deposit_amount)}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Total Price
							</label>
							<p className="mt-1 text-sm font-semibold text-gray-900">
								{formatCurrency(sale.total_price)}
							</p>
						</div>
					</div>

					{/* Links to related entities */}
					<div className="grid gap-4 border-t border-gray-200 pt-4 sm:grid-cols-3">
						{sale.stands && (
							<div>
								<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
									Stand
								</label>
								<button
									onClick={() => navigate(`/stands`)}
									className="mt-1 block text-sm font-medium text-teal-700 active:opacity-80 sm:hover:underline"
								>
									{sale.stands.stand_number} - {sale.stands.location}
								</button>
							</div>
						)}

						{sale.customers && (
							<div>
								<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
									Customer
								</label>
								<button
									onClick={() => navigate(`/customers/${sale.customer_id}`)}
									className="mt-1 block text-sm font-medium text-teal-700 active:opacity-80 sm:hover:underline"
								>
									{customerName}
								</button>
							</div>
						)}

						{sale.agencies && (
							<div>
								<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
									Agency
								</label>
								<button
									onClick={() => navigate(`/agencies/${sale.agency_id}`)}
									className="mt-1 block text-sm font-medium text-teal-700 active:opacity-80 sm:hover:underline"
								>
									{sale.agencies.name}
								</button>
							</div>
						)}
					</div>

					{sale.notes && (
						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Notes
							</label>
							<p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
								{sale.notes}
							</p>
						</div>
					)}

					<div className="flex flex-col gap-3 pt-4 border-t border-gray-200 sm:flex-row">
						<button
							onClick={() => navigate('/sales')}
							className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 active:bg-gray-100 sm:hover:bg-gray-50"
						>
							Back to Sales
						</button>
					</div>
				</div>
			</Card>

			<Card title="Payment History" className="mt-6">
				{payments.length > 0 ? (
					<DataTable
						title=""
						searchableKeys={['payment_date', 'amount', 'payment_method', 'reference_number', 'recorded_by']}
						columns={paymentColumns}
						rows={paymentRows}
					/>
				) : (
					<p className="text-sm text-gray-600">No payments recorded yet.</p>
				)}
			</Card>
		</PageShell>
	)
}

