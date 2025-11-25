import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { getPayments } from '../../lib/api/payments.js'
import { theme } from '../../theme/colors.teal.js'

export default function PaymentReport() {
	const navigate = useNavigate()
	const [payments, setPayments] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	
	// Filter states
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [methodFilter, setMethodFilter] = useState('')

	useEffect(() => {
		loadPayments()
	}, [])

	const loadPayments = async () => {
		try {
			setLoading(true)
			const data = await getPayments()
			setPayments(data)
			setError('')
		} catch (err) {
			console.error('Error loading payments:', err)
			setError(err.message || 'Failed to load payment data')
		} finally {
			setLoading(false)
		}
	}

	const filteredPayments = useMemo(() => {
		let filtered = [...payments]

		if (dateFrom) {
			filtered = filtered.filter(payment => {
				const paymentDate = new Date(payment.payment_date)
				return paymentDate >= new Date(dateFrom)
			})
		}
		if (dateTo) {
			filtered = filtered.filter(payment => {
				const paymentDate = new Date(payment.payment_date)
				const toDate = new Date(dateTo)
				toDate.setHours(23, 59, 59, 999)
				return paymentDate <= toDate
			})
		}
		if (methodFilter) {
			filtered = filtered.filter(payment => payment.payment_method === methodFilter)
		}

		return filtered
	}, [payments, dateFrom, dateTo, methodFilter])

	const summary = useMemo(() => {
		const totalPayments = filteredPayments.length
		const totalAmount = filteredPayments.reduce((acc, p) => acc + parseFloat(p.amount || 0), 0)
		
		const byMethod = filteredPayments.reduce((acc, p) => {
			const method = p.payment_method || 'unknown'
			acc[method] = (acc[method] || 0) + parseFloat(p.amount || 0)
			return acc
		}, {})

		return {
			totalPayments,
			totalAmount,
			byMethod
		}
	}, [filteredPayments])

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	const formatPaymentMethod = (method) => {
		if (!method) return 'N/A'
		return method.split('_').map(word => 
			word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ')
	}

	const exportToCSV = () => {
		const headers = ['Payment Date', 'Contract #', 'Customer', 'Amount', 'Payment Method', 'Reference Number', 'Recorded By']
		const rows = filteredPayments.map(payment => [
			payment.payment_date ? formatDate(payment.payment_date) : 'N/A',
			payment.sales?.contract_number || 'N/A',
			payment.sales?.customers ? `${payment.sales.customers.first_name} ${payment.sales.customers.last_name}` : 'N/A',
			`$${parseFloat(payment.amount || 0).toLocaleString()}`,
			formatPaymentMethod(payment.payment_method),
			payment.reference_number || 'N/A',
			payment.user_profiles?.full_name || 'N/A'
		])

		const csvContent = [
			headers.join(','),
			...rows.map(row => row.map(cell => `"${cell}"`).join(','))
		].join('\n')

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const link = document.createElement('a')
		const url = URL.createObjectURL(blob)
		link.setAttribute('href', url)
		link.setAttribute('download', `payments-report-${new Date().toISOString().split('T')[0]}.csv`)
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	const columns = [
		{ key: 'payment_date', header: 'Date' },
		{ key: 'contract', header: 'Contract #' },
		{ key: 'customer', header: 'Customer' },
		{ key: 'amount', header: 'Amount' },
		{ key: 'payment_method', header: 'Method' },
		{ key: 'reference_number', header: 'Reference' },
		{ key: 'recorded_by', header: 'Recorded By' },
	]

	const rows = filteredPayments.map((payment) => ({
		...payment,
		payment_date: formatDate(payment.payment_date),
		contract: payment.sales?.contract_number || 'N/A',
		customer: payment.sales?.customers 
			? `${payment.sales.customers.first_name} ${payment.sales.customers.last_name}`
			: 'N/A',
		amount: `$${parseFloat(payment.amount || 0).toLocaleString()}`,
		payment_method: formatPaymentMethod(payment.payment_method),
		reference_number: payment.reference_number || 'N/A',
		recorded_by: payment.user_profiles?.full_name || 'N/A',
	}))

	return (
		<PageShell title="Payment Report">
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<button
					onClick={() => navigate('/reports')}
					className="text-sm text-teal-700 hover:text-teal-800 underline"
				>
					← Back to Reports
				</button>
				<button
					onClick={exportToCSV}
					className={`rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}
				>
					Export to CSV
				</button>
			</div>

			{error && (
				<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{/* Summary Cards */}
			<div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card title="Total Payments">
					<p className="text-2xl font-semibold text-teal-700">{summary.totalPayments}</p>
				</Card>
				<Card title="Total Amount">
					<p className="text-2xl font-semibold text-teal-700">${summary.totalAmount.toLocaleString()}</p>
				</Card>
				<Card title="By Cash">
					<p className="text-2xl font-semibold text-green-700">${(summary.byMethod.cash || 0).toLocaleString()}</p>
				</Card>
				<Card title="By Transfer">
					<p className="text-2xl font-semibold text-blue-700">${((summary.byMethod.bank_transfer || 0) + (summary.byMethod.mobile_money || 0)).toLocaleString()}</p>
				</Card>
			</div>

			{/* Filters */}
			<Card title="Filters" className="mb-4">
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700">Date From</label>
						<input
							type="date"
							value={dateFrom}
							onChange={(e) => setDateFrom(e.target.value)}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
						/>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700">Date To</label>
						<input
							type="date"
							value={dateTo}
							onChange={(e) => setDateTo(e.target.value)}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
						/>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700">Payment Method</label>
						<select
							value={methodFilter}
							onChange={(e) => setMethodFilter(e.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
						>
							<option value="">All Methods</option>
							<option value="cash">Cash</option>
							<option value="bank_transfer">Bank Transfer</option>
							<option value="mobile_money">Mobile Money</option>
							<option value="cheque">Cheque</option>
						</select>
					</div>
				</div>
			</Card>

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading report...</p>
					</div>
				</div>
			) : (
				<DataTable
					title={`Payment Report (${filteredPayments.length} records)`}
					searchableKeys={['contract', 'customer', 'reference_number']}
					columns={columns}
					rows={rows}
					pageSize={20}
				/>
			)}
		</PageShell>
	)
}



