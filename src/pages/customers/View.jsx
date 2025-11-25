import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { getCustomer } from '../../lib/api/customers.js'
import { getSalesByCustomer } from '../../lib/api/sales.js'
import { useRole } from '../../hooks/useRole.js'
import { theme } from '../../theme/colors.teal.js'

export default function CustomerView() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { isAdmin, canCreateSales } = useRole()
	const [customer, setCustomer] = useState(null)
	const [sales, setSales] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		loadCustomer()
		loadSales()
	}, [id])

	const loadCustomer = async () => {
		try {
			setLoading(true)
			const data = await getCustomer(id)
			setCustomer(data)
			setError('')
		} catch (err) {
			console.error('Error loading customer:', err)
			setError(err.message || 'Failed to load customer')
		} finally {
			setLoading(false)
		}
	}

	const loadSales = async () => {
		try {
			const data = await getSalesByCustomer(id)
			setSales(data)
		} catch (err) {
			console.error('Error loading sales:', err)
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

	if (loading) {
		return (
			<PageShell title="Customer Details">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading customer...</p>
					</div>
				</div>
			</PageShell>
		)
	}

	if (error || !customer) {
		return (
			<PageShell title="Customer Details">
				<Card title="Error">
					<div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{error || 'Customer not found'}
					</div>
					<button
						onClick={() => navigate('/customers')}
						className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 active:bg-gray-100 sm:hover:bg-gray-50"
					>
						Back to Customers
					</button>
				</Card>
			</PageShell>
		)
	}

	const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'N/A'

	const salesColumns = [
		{ key: 'contract_number', header: 'Contract #' },
		{ key: 'stand_number', header: 'Stand' },
		{ key: 'agency_name', header: 'Agency' },
		{ key: 'sale_date', header: 'Sale Date' },
		{ key: 'total_price', header: 'Total Price' },
		{ key: 'balance_remaining', header: 'Balance' },
		{ 
			key: 'status', 
			header: 'Status',
			render: (value) => (
				<Badge color={getStatusColor(value)}>
					{value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
				</Badge>
			)
		},
		{ key: 'actions', header: 'Actions' },
	]

	const salesRows = sales.map((sale) => ({
		...sale,
		contract_number: sale.contract_number || 'N/A',
		stand_number: sale.stands?.stand_number || 'N/A',
		agency_name: sale.agencies?.name || 'N/A',
		sale_date: formatDate(sale.sale_date),
		total_price: formatCurrency(sale.total_price),
		balance_remaining: formatCurrency(sale.balance_remaining),
		actions: (
			<button
				onClick={() => navigate(`/sales/${sale.id}`)}
				className="rounded px-2 py-1 text-sm text-teal-700 active:bg-teal-50 sm:hover:underline"
			>
				View
			</button>
		),
	}))

	return (
		<PageShell title="Customer Details">
			<Card title={customerName}>
				<div className="space-y-4">
					{(isAdmin || canCreateSales) && (
						<div className="flex justify-end">
							<button
								onClick={() => navigate(`/customers/${customer.id}/edit`)}
								className={`rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}
							>
								Edit Customer
							</button>
						</div>
					)}

					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								First Name
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{customer.first_name || 'N/A'}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Last Name
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{customer.last_name || 'N/A'}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								ID Number
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{customer.id_number || 'N/A'}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Email
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{customer.email || 'N/A'}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Phone
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{customer.phone || 'N/A'}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Created
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{formatDate(customer.created_at)}
							</p>
						</div>

						{customer.address && (
							<div className="sm:col-span-2">
								<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
									Address
								</label>
								<p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
									{customer.address}
								</p>
							</div>
						)}

						{customer.notes && (
							<div className="sm:col-span-2">
								<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
									Notes
								</label>
								<p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
									{customer.notes}
								</p>
							</div>
						)}
					</div>

					<div className="flex flex-col gap-3 pt-4 border-t border-gray-200 sm:flex-row">
						<button
							onClick={() => navigate('/customers')}
							className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 active:bg-gray-100 sm:hover:bg-gray-50"
						>
							Back to Customers
						</button>
					</div>
				</div>
			</Card>

			{sales.length > 0 && (
				<Card title="Purchase History" className="mt-6">
					<DataTable
						title=""
						searchableKeys={['contract_number', 'stand_number', 'agency_name']}
						columns={salesColumns}
						rows={salesRows}
					/>
				</Card>
			)}

			{sales.length === 0 && (
				<Card title="Purchase History" className="mt-6">
					<p className="text-sm text-gray-600">No purchases found for this customer.</p>
				</Card>
			)}
		</PageShell>
	)
}


