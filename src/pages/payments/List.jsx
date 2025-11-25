import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { ButtonLink } from '../../components/ui/ButtonLink.jsx'
import { FloatingActionButton } from '../../components/ui/FloatingActionButton.jsx'
import { useRole } from '../../hooks/useRole.js'
import { getPayments, deletePayment } from '../../lib/api/payments.js'
import { theme } from '../../theme/colors.teal.js'

export default function PaymentsList() {
	const navigate = useNavigate()
	const { canCreateSales, isAdmin } = useRole()
	const [payments, setPayments] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

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
			setError(err.message || 'Failed to load payments')
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this payment?')) {
			return
		}

		try {
			await deletePayment(id)
			await loadPayments()
		} catch (err) {
			console.error('Error deleting payment:', err)
			alert('Failed to delete payment: ' + (err.message || 'Unknown error'))
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

	const formatPaymentMethod = (method) => {
		if (!method) return 'N/A'
		return method.split('_').map(word => 
			word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ')
	}

	const columns = [
		{ key: 'payment_date', header: 'Date' },
		{ key: 'contract', header: 'Contract #' },
		{ key: 'customer', header: 'Customer' },
		{ key: 'amount', header: 'Amount' },
		{ key: 'payment_method', header: 'Method' },
		{ key: 'reference_number', header: 'Reference' },
		{ key: 'recorded_by', header: 'Recorded By' },
		{ key: 'actions', header: 'Actions' },
	]

	const rows = payments.map((payment) => ({
		...payment,
		contract: payment.sales?.contract_number || 'N/A',
		customer: payment.sales?.customers 
			? `${payment.sales.customers.first_name} ${payment.sales.customers.last_name}`
			: 'N/A',
		payment_date: formatDate(payment.payment_date),
		amount: `$${parseFloat(payment.amount || 0).toLocaleString()}`,
		payment_method: formatPaymentMethod(payment.payment_method),
		reference_number: payment.reference_number || 'N/A',
		recorded_by: payment.user_profiles?.full_name || 'N/A',
		actions: isAdmin ? (
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => navigate(`/payments/${payment.id}/edit`)}
					className="rounded px-2 py-1 text-sm text-blue-700 active:bg-blue-50 sm:hover:underline"
				>
					Edit
				</button>
				<button
					onClick={() => handleDelete(payment.id)}
					className="rounded px-2 py-1 text-sm text-red-700 active:bg-red-50 sm:hover:underline"
				>
					Delete
				</button>
			</div>
		) : null,
	}))

	return (
		<PageShell title="Payments">
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-600">
						Track and manage payment records
					</p>
				</div>
				{canCreateSales && (
					<>
						<div className="hidden sm:block">
							<ButtonLink to="/payments/new" className={theme.btnPrimary}>
								+ Record New Payment
							</ButtonLink>
						</div>
						<FloatingActionButton
							to="/payments/new"
							label="Record Payment"
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
						<p className="text-gray-600">Loading payments...</p>
					</div>
				</div>
			) : (
				<DataTable
					title=""
					searchableKeys={['contract', 'customer', 'payment_method', 'reference_number']}
					columns={columns}
					rows={rows}
				/>
			)}
		</PageShell>
	)
}


