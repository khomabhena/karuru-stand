import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { getSales } from '../../lib/api/sales.js'
import { getAgencies } from '../../lib/api/agencies.js'
import { getCustomers } from '../../lib/api/customers.js'
import { useRole } from '../../hooks/useRole.js'
import { theme } from '../../theme/colors.teal.js'

export default function SalesReport() {
	const navigate = useNavigate()
	const { isAgencyStaff, isAgencyManager, agencyId } = useRole()
	const [sales, setSales] = useState([])
	const [agencies, setAgencies] = useState([])
	const [customers, setCustomers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	
	// Filter states
	const [dateFrom, setDateFrom] = useState('')
	const [dateTo, setDateTo] = useState('')
	const [agencyFilter, setAgencyFilter] = useState('')
	const [customerFilter, setCustomerFilter] = useState('')
	const [statusFilter, setStatusFilter] = useState('')
	
	// For agency staff/manager, pre-set agency filter to their agency
	useEffect(() => {
		if ((isAgencyStaff || isAgencyManager) && agencyId && !agencyFilter) {
			setAgencyFilter(agencyId)
		}
	}, [isAgencyStaff, isAgencyManager, agencyId, agencyFilter])

	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		try {
			setLoading(true)
			const [salesData, agenciesData, customersData] = await Promise.all([
				getSales(),
				getAgencies(),
				getCustomers()
			])
			setSales(salesData)
			
			// For agency staff/manager, only show their agency
			if (isAgencyStaff || isAgencyManager) {
				setAgencies(agenciesData.filter(a => a.is_active && a.id === agencyId))
			} else {
				setAgencies(agenciesData.filter(a => a.is_active))
			}
			
			setCustomers(customersData)
			setError('')
		} catch (err) {
			console.error('Error loading report data:', err)
			setError(err.message || 'Failed to load report data')
		} finally {
			setLoading(false)
		}
	}

	const filteredSales = useMemo(() => {
		let filtered = [...sales]

		if (dateFrom) {
			filtered = filtered.filter(sale => {
				const saleDate = new Date(sale.sale_date)
				return saleDate >= new Date(dateFrom)
			})
		}
		if (dateTo) {
			filtered = filtered.filter(sale => {
				const saleDate = new Date(sale.sale_date)
				const toDate = new Date(dateTo)
				toDate.setHours(23, 59, 59, 999)
				return saleDate <= toDate
			})
		}
		if (agencyFilter) {
			filtered = filtered.filter(sale => sale.agency_id === agencyFilter)
		}
		if (customerFilter) {
			filtered = filtered.filter(sale => sale.customer_id === customerFilter)
		}
		if (statusFilter) {
			filtered = filtered.filter(sale => sale.status === statusFilter)
		}

		return filtered
	}, [sales, dateFrom, dateTo, agencyFilter, customerFilter, statusFilter])

	const summary = useMemo(() => {
		const totalSales = filteredSales.length
		const totalRevenue = filteredSales.reduce((acc, s) => acc + parseFloat(s.total_price || 0), 0)
		const totalDeposits = filteredSales.reduce((acc, s) => acc + parseFloat(s.deposit_amount || 0), 0)
		const totalOutstanding = filteredSales.reduce((acc, s) => acc + parseFloat(s.balance_remaining || 0), 0)
		const totalPaid = totalRevenue - totalOutstanding

		return {
			totalSales,
			totalRevenue,
			totalDeposits,
			totalOutstanding,
			totalPaid
		}
	}, [filteredSales])

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	const formatStatus = (status) => {
		if (!status) return 'N/A'
		return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
	}

	const exportToCSV = () => {
		const headers = ['Contract #', 'Sale Date', 'Stand', 'Customer', 'Agency', 'Total Price', 'Deposit', 'Balance', 'Status', 'Payment Plan']
		const rows = filteredSales.map(sale => [
			sale.contract_number || 'N/A',
			sale.sale_date ? formatDate(sale.sale_date) : 'N/A',
			sale.stands?.stand_number || 'N/A',
			sale.customers ? `${sale.customers.first_name} ${sale.customers.last_name}` : 'N/A',
			sale.agencies?.name || 'N/A',
			`$${parseFloat(sale.total_price || 0).toLocaleString()}`,
			`$${parseFloat(sale.deposit_amount || 0).toLocaleString()}`,
			`$${parseFloat(sale.balance_remaining || 0).toLocaleString()}`,
			formatStatus(sale.status),
			sale.payment_plan || 'N/A'
		])

		const csvContent = [
			headers.join(','),
			...rows.map(row => row.map(cell => `"${cell}"`).join(','))
		].join('\n')

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const link = document.createElement('a')
		const url = URL.createObjectURL(blob)
		link.setAttribute('href', url)
		link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.csv`)
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	const columns = [
		{ key: 'contract_number', header: 'Contract #' },
		{ key: 'sale_date', header: 'Sale Date' },
		{ key: 'stand', header: 'Stand' },
		{ key: 'customer', header: 'Customer' },
		{ key: 'agency', header: 'Agency' },
		{ key: 'total_price', header: 'Total Price' },
		{ key: 'deposit_amount', header: 'Deposit' },
		{ key: 'balance_remaining', header: 'Balance' },
		{ key: 'status', header: 'Status' },
		{ key: 'payment_plan', header: 'Payment Plan' },
	]

	const rows = filteredSales.map((sale) => ({
		...sale,
		sale_date: formatDate(sale.sale_date),
		stand: sale.stands?.stand_number || 'N/A',
		customer: sale.customers ? `${sale.customers.first_name} ${sale.customers.last_name}` : 'N/A',
		agency: sale.agencies?.name || 'N/A',
		total_price: `$${parseFloat(sale.total_price || 0).toLocaleString()}`,
		deposit_amount: `$${parseFloat(sale.deposit_amount || 0).toLocaleString()}`,
		balance_remaining: `$${parseFloat(sale.balance_remaining || 0).toLocaleString()}`,
		status: formatStatus(sale.status),
		payment_plan: sale.payment_plan || 'N/A',
	}))

	return (
		<PageShell title="Sales Report">
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
			<div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
				<Card title="Total Sales">
					<p className="text-2xl font-semibold text-teal-700">{summary.totalSales}</p>
				</Card>
				<Card title="Total Revenue">
					<p className="text-2xl font-semibold text-teal-700">${summary.totalRevenue.toLocaleString()}</p>
				</Card>
				<Card title="Total Deposits">
					<p className="text-2xl font-semibold text-blue-700">${summary.totalDeposits.toLocaleString()}</p>
				</Card>
				<Card title="Total Paid">
					<p className="text-2xl font-semibold text-green-700">${summary.totalPaid.toLocaleString()}</p>
				</Card>
				<Card title="Outstanding">
					<p className="text-2xl font-semibold text-amber-700">${summary.totalOutstanding.toLocaleString()}</p>
				</Card>
			</div>

			{/* Filters */}
			<Card title="Filters" className="mb-4">
				<div className={`grid gap-3 ${isAgencyStaff || isAgencyManager ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-5'}`}>
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
					{/* Hide agency filter for agency staff/manager - they only see their own agency */}
					{!isAgencyStaff && !isAgencyManager && (
						<div>
							<label className="mb-1 block text-xs font-medium text-gray-700">Agency</label>
							<select
								value={agencyFilter}
								onChange={(e) => setAgencyFilter(e.target.value)}
								className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
							>
								<option value="">All Agencies</option>
								{agencies.map(agency => (
									<option key={agency.id} value={agency.id}>{agency.name}</option>
								))}
							</select>
						</div>
					)}
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700">Customer</label>
						<select
							value={customerFilter}
							onChange={(e) => setCustomerFilter(e.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
						>
							<option value="">All Customers</option>
							{customers.map(customer => (
								<option key={customer.id} value={customer.id}>
									{`${customer.first_name} ${customer.last_name}`}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700">Status</label>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
						>
							<option value="">All Statuses</option>
							<option value="pending">Pending</option>
							<option value="in_progress">In Progress</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
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
					title={`Sales Report (${filteredSales.length} records)`}
					searchableKeys={['contract_number', 'stand', 'customer', 'agency']}
					columns={columns}
					rows={rows}
					pageSize={20}
				/>
			)}
		</PageShell>
	)
}

