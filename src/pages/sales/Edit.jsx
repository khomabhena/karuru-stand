import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { getSale, updateSale } from '../../lib/api/sales.js'
import { getStands } from '../../lib/api/stands.js'
import { getCustomers } from '../../lib/api/customers.js'
import { getAgencies } from '../../lib/api/agencies.js'
import { getPaymentsBySale } from '../../lib/api/payments.js'
import { useRole } from '../../hooks/useRole.js'
import { theme } from '../../theme/colors.teal.js'

export default function EditSale() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { isAdmin } = useRole()
	const [loading, setLoading] = useState(false)
	const [loadingData, setLoadingData] = useState(true)
	const [error, setError] = useState('')
	const [stands, setStands] = useState([])
	const [customers, setCustomers] = useState([])
	const [agencies, setAgencies] = useState([])
	const [payments, setPayments] = useState([])
	
	const [formData, setFormData] = useState({
		stand_id: '',
		customer_id: '',
		agency_id: '',
		sale_date: '',
		contract_number: '',
		total_price: '',
		deposit_amount: '',
		balance_remaining: '',
		payment_plan: 'monthly',
		status: 'pending',
		notes: '',
	})

	useEffect(() => {
		loadData()
	}, [id])

	const loadData = async () => {
		try {
			setLoadingData(true)
			const [saleData, standsData, customersData, agenciesData, paymentsData] = await Promise.all([
				getSale(id),
				getStands(),
				getCustomers(),
				getAgencies(),
				getPaymentsBySale(id)
			])
			
			setStands(standsData)
			setCustomers(customersData)
			setAgencies(agenciesData.filter(a => a.is_active))
			setPayments(paymentsData)

			// Calculate total paid from payments
			const totalPaid = paymentsData.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
			const newBalance = parseFloat(saleData.total_price) - totalPaid

			setFormData({
				stand_id: saleData.stand_id || '',
				customer_id: saleData.customer_id || '',
				agency_id: saleData.agency_id || '',
				sale_date: saleData.sale_date ? saleData.sale_date.slice(0, 10) : '',
				contract_number: saleData.contract_number || '',
				total_price: saleData.total_price?.toString() || '',
				deposit_amount: saleData.deposit_amount?.toString() || '',
				balance_remaining: newBalance.toFixed(2),
				payment_plan: saleData.payment_plan || 'monthly',
				status: saleData.status || 'pending',
				notes: saleData.notes || '',
			})
			setError('')
		} catch (err) {
			console.error('Error loading sale:', err)
			setError(err.message || 'Failed to load sale')
		} finally {
			setLoadingData(false)
		}
	}

	useEffect(() => {
		// Recalculate balance when total_price changes (but don't update if payments exist)
		if (formData.total_price && payments.length === 0) {
			const deposit = parseFloat(formData.deposit_amount || 0)
			const total = parseFloat(formData.total_price)
			const balance = total - deposit
			setFormData(prev => ({ ...prev, balance_remaining: Math.max(0, balance).toFixed(2) }))
		}
	}, [formData.total_price, formData.deposit_amount, payments.length])

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			// Validation
			if (!formData.stand_id || !formData.customer_id || !formData.agency_id) {
				setError('Please select stand, customer, and agency')
				setLoading(false)
				return
			}

			if (!formData.total_price) {
				setError('Please enter total price')
				setLoading(false)
				return
			}

			const total = parseFloat(formData.total_price)
			const deposit = parseFloat(formData.deposit_amount || 0)

			if (deposit > total) {
				setError('Deposit cannot exceed total price')
				setLoading(false)
				return
			}

			// Calculate balance: if payments exist, use actual balance from payments
			// Otherwise, use total - deposit
			let balanceRemaining
			if (payments.length > 0) {
				const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
				balanceRemaining = total - totalPaid
			} else {
				balanceRemaining = total - deposit
			}

			// Determine status based on balance
			let status = formData.status
			if (balanceRemaining <= 0) {
				status = 'completed'
			} else if (balanceRemaining < total) {
				status = 'in_progress'
			} else {
				status = 'pending'
			}

			const saleData = {
				stand_id: formData.stand_id,
				customer_id: formData.customer_id,
				agency_id: formData.agency_id,
				sale_date: formData.sale_date,
				contract_number: formData.contract_number,
				total_price: total,
				deposit_amount: deposit,
				balance_remaining: Math.max(0, balanceRemaining),
				payment_plan: formData.payment_plan,
				status: status,
				notes: formData.notes || null,
			}

			await updateSale(id, saleData)
			navigate('/sales')
		} catch (err) {
			console.error('Error updating sale:', err)
			setError(err.message || 'Failed to update sale. Please try again.')
			setLoading(false)
		}
	}

	if (loadingData) {
		return (
			<PageShell title="Edit Sale">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading sale...</p>
					</div>
				</div>
			</PageShell>
		)
	}

	if (!isAdmin) {
		return (
			<PageShell title="Edit Sale">
				<Card title="Access Denied">
					<div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
						Only administrators can edit sales.
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

	return (
		<PageShell title="Edit Sale">
			<Card title="Sale details">
				{error && (
					<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				{payments.length > 0 && (
					<div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
						<p className="font-medium">Note: This sale has {payments.length} payment(s) recorded.</p>
						<p className="text-xs mt-1">Balance will be recalculated based on existing payments.</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
					<Select
						label="Stand *"
						name="stand_id"
						value={formData.stand_id}
						onChange={handleChange}
						options={stands.map(s => ({ 
							value: s.id, 
							label: `${s.stand_number} - ${s.location} ($${parseFloat(s.price).toLocaleString()})` 
						}))}
						required
						disabled={loading}
					/>
					<Select
						label="Customer *"
						name="customer_id"
						value={formData.customer_id}
						onChange={handleChange}
						options={customers.map(c => ({ 
							value: c.id, 
							label: `${c.first_name} ${c.last_name}${c.phone ? ` - ${c.phone}` : ''}` 
						}))}
						required
						disabled={loading}
					/>
					<Select
						label="Agency *"
						name="agency_id"
						value={formData.agency_id}
						onChange={handleChange}
						options={agencies.map(a => ({ 
							value: a.id, 
							label: a.name 
						}))}
						required
						disabled={loading}
					/>
					<Input
						label="Sale Date *"
						name="sale_date"
						type="date"
						value={formData.sale_date}
						onChange={handleChange}
						required
						disabled={loading}
					/>
					<Input
						label="Contract Number"
						name="contract_number"
						value={formData.contract_number}
						readOnly
						disabled={loading}
					/>
					<Input
						label="Total Price ($) *"
						name="total_price"
						type="number"
						step="0.01"
						value={formData.total_price}
						onChange={handleChange}
						required
						disabled={loading}
					/>
					<Input
						label="Deposit Amount ($)"
						name="deposit_amount"
						type="number"
						step="0.01"
						value={formData.deposit_amount}
						onChange={handleChange}
						disabled={loading || payments.length > 0}
					/>
					<Input
						label="Balance Remaining ($)"
						name="balance_remaining"
						type="number"
						value={formData.balance_remaining}
						disabled
						className="bg-gray-50"
					/>
					<Select
						label="Payment Plan"
						name="payment_plan"
						value={formData.payment_plan}
						onChange={handleChange}
						options={[
							{ value: 'full', label: 'Full Payment' },
							{ value: 'monthly', label: 'Monthly' },
							{ value: 'quarterly', label: 'Quarterly' },
							{ value: 'custom', label: 'Custom' },
						]}
						disabled={loading}
					/>
					<Select
						label="Status"
						name="status"
						value={formData.status}
						onChange={handleChange}
						options={[
							{ value: 'pending', label: 'Pending' },
							{ value: 'in_progress', label: 'In Progress' },
							{ value: 'completed', label: 'Completed' },
							{ value: 'cancelled', label: 'Cancelled' },
						]}
						disabled={loading}
					/>
					<div className="sm:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Notes
						</label>
						<textarea
							name="notes"
							value={formData.notes}
							onChange={handleChange}
							rows={3}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
							disabled={loading}
						/>
					</div>
					<div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
						<button
							type="submit"
							disabled={loading}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-opacity active:opacity-80 ${
								loading ? 'opacity-50 cursor-not-allowed' : ''
							} ${theme.btnPrimary}`}
						>
							{loading ? 'Updating...' : 'Update Sale'}
						</button>
						<button
							type="button"
							onClick={() => navigate('/sales')}
							disabled={loading}
							className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 active:bg-gray-100 sm:hover:bg-gray-50"
						>
							Cancel
						</button>
					</div>
				</form>
			</Card>
		</PageShell>
	)
}

