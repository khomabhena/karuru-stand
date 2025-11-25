import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { ButtonLink } from '../../components/ui/ButtonLink.jsx'
import { FloatingActionButton } from '../../components/ui/FloatingActionButton.jsx'
import { useRole } from '../../hooks/useRole.js'
import { getCustomers, deleteCustomer } from '../../lib/api/customers.js'
import { theme } from '../../theme/colors.teal.js'
import { SEO } from '../../components/SEO.jsx'

export default function CustomersList() {
	const navigate = useNavigate()
	const { isAdmin, canCreateSales } = useRole()
	const [customers, setCustomers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		loadCustomers()
	}, [])

	const loadCustomers = async () => {
		try {
			setLoading(true)
			const data = await getCustomers()
			setCustomers(data)
			setError('')
		} catch (err) {
			console.error('Error loading customers:', err)
			setError(err.message || 'Failed to load customers')
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id, name) => {
		if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
			return
		}

		try {
			await deleteCustomer(id)
			await loadCustomers()
		} catch (err) {
			console.error('Error deleting customer:', err)
			alert('Failed to delete customer: ' + (err.message || 'Unknown error'))
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
		{ key: 'name', header: 'Name' },
		{ key: 'email', header: 'Email' },
		{ key: 'phone', header: 'Phone' },
		{ key: 'id_number', header: 'ID Number' },
		{ key: 'actions', header: 'Actions' },
	]

	const rows = customers.map((customer) => ({
		...customer,
		name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'N/A',
		actions: (
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => navigate(`/customers/${customer.id}`)}
					className="rounded px-2 py-1 text-sm text-teal-700 active:bg-teal-50 sm:hover:underline"
				>
					View
				</button>
				{(isAdmin || canCreateSales) && (
					<>
						<button
							onClick={() => navigate(`/customers/${customer.id}/edit`)}
							className="rounded px-2 py-1 text-sm text-blue-700 active:bg-blue-50 sm:hover:underline"
						>
							Edit
						</button>
						{isAdmin && (
							<button
								onClick={() => handleDelete(customer.id, `${customer.first_name} ${customer.last_name}`)}
								className="rounded px-2 py-1 text-sm text-red-700 active:bg-red-50 sm:hover:underline"
							>
								Delete
							</button>
						)}
					</>
				)}
			</div>
		),
	}))

	return (
		<>
			<SEO 
				title="Customers"
				description="Manage customer information and view purchase history. Track customer details, contact information, and their stand purchases."
				url="https://karuru-stand.vercel.app/customers"
			/>
			<PageShell title="Customers">
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-600">
						Manage customer information and purchase history
					</p>
				</div>
				{(isAdmin || canCreateSales) && (
					<>
						<div className="hidden sm:block">
							<ButtonLink to="/customers/new" className={theme.btnPrimary}>
								+ Add New Customer
							</ButtonLink>
						</div>
						<FloatingActionButton
							to="/customers/new"
							label="Add Customer"
						/>
					</>
				)}
			</div>

			{error && (
				<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading customers...</p>
					</div>
				</div>
			) : (
				<DataTable
					title=""
					searchableKeys={['first_name', 'last_name', 'email', 'phone', 'id_number']}
					columns={columns}
					rows={rows}
				/>
			)}
		</PageShell>
		</>
	)
}


