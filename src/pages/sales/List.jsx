import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { ButtonLink } from '../../components/ui/ButtonLink.jsx'
import { FloatingActionButton } from '../../components/ui/FloatingActionButton.jsx'
import { useRole } from '../../hooks/useRole.js'
import { getSales, deleteSale } from '../../lib/api/sales.js'
import { getAgencies } from '../../lib/api/agencies.js'
import { getCustomers } from '../../lib/api/customers.js'
import { theme } from '../../theme/colors.teal.js'
import { SEO } from '../../components/SEO.jsx'

export default function SalesList() {
	const navigate = useNavigate()
	const { canCreateSales, isAdmin, isAgencyStaff, isAgencyManager, agencyId } = useRole()
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
			console.error('Error loading data:', err)
			setError(err.message || 'Failed to load data')
		} finally {
			setLoading(false)
		}
	}

	// Filter sales based on selected filters
	const filteredSales = useMemo(() => {
		let filtered = [...sales]

		// Date range filter
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
				toDate.setHours(23, 59, 59, 999) // Include entire end date
				return saleDate <= toDate
			})
		}

		// Agency filter
		if (agencyFilter) {
			filtered = filtered.filter(sale => sale.agency_id === agencyFilter)
		}

		// Customer filter
		if (customerFilter) {
			filtered = filtered.filter(sale => sale.customer_id === customerFilter)
		}

		// Status filter
		if (statusFilter) {
			filtered = filtered.filter(sale => sale.status === statusFilter)
		}

		return filtered
	}, [sales, dateFrom, dateTo, agencyFilter, customerFilter, statusFilter])

	const clearFilters = () => {
		setDateFrom('')
		setDateTo('')
		// For agency staff/manager, keep their agency filter set
		if (!isAgencyStaff && !isAgencyManager) {
			setAgencyFilter('')
		} else if (agencyId) {
			setAgencyFilter(agencyId)
		}
		setCustomerFilter('')
		setStatusFilter('')
	}

	const hasActiveFilters = dateFrom || dateTo || agencyFilter || customerFilter || statusFilter

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this sale?')) {
			return
		}

		try {
			await deleteSale(id)
			await loadSales()
		} catch (err) {
			console.error('Error deleting sale:', err)
			alert('Failed to delete sale: ' + (err.message || 'Unknown error'))
		}
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'pending': return 'warning'
			case 'in_progress': return 'info'
			case 'completed': return 'success'
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

	const columns = [
		{ key: 'contract_number', header: 'Contract #' },
		{ key: 'stand', header: 'Stand' },
		{ key: 'customer', header: 'Customer' },
		{ key: 'agency', header: 'Agency' },
		{ key: 'sale_date', header: 'Sale Date' },
		{ key: 'total_price', header: 'Total Price' },
		{ key: 'balance_remaining', header: 'Balance' },
		{ 
			key: 'status', 
			header: 'Status',
			render: (value) => (
				<Badge color={getStatusColor(value)}>
					{value?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}
				</Badge>
			)
		},
		{ key: 'actions', header: 'Actions' },
	]

	const rows = filteredSales.map((sale) => ({
		...sale,
		stand: sale.stands?.stand_number || 'N/A',
		customer: sale.customers ? `${sale.customers.first_name} ${sale.customers.last_name}` : 'N/A',
		agency: sale.agencies?.name || 'N/A',
		sale_date: formatDate(sale.sale_date),
		total_price: `$${parseFloat(sale.total_price || 0).toLocaleString()}`,
		balance_remaining: `$${parseFloat(sale.balance_remaining || 0).toLocaleString()}`,
		actions: (
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => navigate(`/sales/${sale.id}`)}
					className="rounded px-2 py-1 text-sm text-teal-700 active:bg-teal-50 sm:hover:underline"
				>
					View
				</button>
				{isAdmin && (
					<>
						<button
							onClick={() => navigate(`/sales/${sale.id}/edit`)}
							className="rounded px-2 py-1 text-sm text-blue-700 active:bg-blue-50 sm:hover:underline"
						>
							Edit
						</button>
						<button
							onClick={() => handleDelete(sale.id)}
							className="rounded px-2 py-1 text-sm text-red-700 active:bg-red-50 sm:hover:underline"
						>
							Delete
						</button>
					</>
				)}
			</div>
		),
	}))

	return (
		<>
			<SEO 
				title="Sales"
				description="View and manage all sales transactions. Track contracts, customers, stands, and payment statuses with advanced filtering options."
				url="https://karuru-stand.vercel.app/sales"
			/>
			<PageShell title="Sales">
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-600">
						Manage sales transactions and contracts
					</p>
				</div>
				{canCreateSales && (
					<>
						<div className="hidden sm:block">
							<ButtonLink to="/sales/new" className={theme.btnPrimary}>
								+ Create New Sale
							</ButtonLink>
						</div>
						<FloatingActionButton
							to="/sales/new"
							label="New Sale"
						/>
					</>
				)}
			</div>

			{error && (
				<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{/* Advanced Filters */}
			<div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
				<div className="mb-3 flex items-center justify-between">
					<h3 className="text-sm font-semibold text-gray-900">Filters</h3>
					{hasActiveFilters && (
						<button
							onClick={clearFilters}
							className="text-xs text-teal-700 hover:text-teal-800 underline"
						>
							Clear All
						</button>
					)}
				</div>
				<div className={`grid gap-3 ${isAgencyStaff || isAgencyManager ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-5'}`}>
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700">
							Date From
						</label>
						<input
							type="date"
							value={dateFrom}
							onChange={(e) => setDateFrom(e.target.value)}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
						/>
					</div>
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700">
							Date To
						</label>
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
							<label className="mb-1 block text-xs font-medium text-gray-700">
								Agency
							</label>
							<select
								value={agencyFilter}
								onChange={(e) => setAgencyFilter(e.target.value)}
								className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
							>
								<option value="">All Agencies</option>
								{agencies.map(agency => (
									<option key={agency.id} value={agency.id}>
										{agency.name}
									</option>
								))}
							</select>
						</div>
					)}
					<div>
						<label className="mb-1 block text-xs font-medium text-gray-700">
							Customer
						</label>
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
						<label className="mb-1 block text-xs font-medium text-gray-700">
							Status
						</label>
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
				{hasActiveFilters && (
					<div className="mt-3 text-xs text-gray-600">
						Showing {filteredSales.length} of {sales.length} sales
					</div>
				)}
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading sales...</p>
					</div>
				</div>
			) : (
				<DataTable
					title=""
					searchableKeys={['contract_number', 'stand', 'customer', 'agency', 'status']}
					columns={columns}
					rows={rows}
				/>
			)}
		</PageShell>
		</>
	)
}


