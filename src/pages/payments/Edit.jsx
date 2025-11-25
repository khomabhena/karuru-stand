import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { getPayment, updatePayment } from '../../lib/api/payments.js'
import { useRole } from '../../hooks/useRole.js'
import { theme } from '../../theme/colors.teal.js'

export default function EditPayment() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { isAdmin } = useRole()
	const [loading, setLoading] = useState(false)
	const [loadingData, setLoadingData] = useState(true)
	const [error, setError] = useState('')
	const [sale, setSale] = useState(null)
	const [originalAmount, setOriginalAmount] = useState(0)
	
	const [formData, setFormData] = useState({
		payment_date: '',
		amount: '',
		payment_method: 'cash',
		reference_number: '',
		notes: '',
	})

	useEffect(() => {
		loadPayment()
	}, [id])

	const loadPayment = async () => {
		try {
			setLoadingData(true)
			const payment = await getPayment(id)
			
			setSale(payment.sales)
			setOriginalAmount(parseFloat(payment.amount || 0))
			setFormData({
				payment_date: payment.payment_date ? payment.payment_date.slice(0, 10) : '',
				amount: payment.amount?.toString() || '',
				payment_method: payment.payment_method || 'cash',
				reference_number: payment.reference_number || '',
				notes: payment.notes || '',
			})
			setError('')
		} catch (err) {
			console.error('Error loading payment:', err)
			setError(err.message || 'Failed to load payment')
		} finally {
			setLoadingData(false)
		}
	}

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
			if (!formData.payment_date || !formData.amount) {
				setError('Please fill in payment date and amount')
				setLoading(false)
				return
			}

			const amount = parseFloat(formData.amount)
			if (amount <= 0) {
				setError('Amount must be greater than 0')
				setLoading(false)
				return
			}

			// Check if new amount exceeds remaining balance
			// When editing, we need to account for the original payment amount
			// New balance = current balance + original amount - new amount
			if (sale) {
				const currentBalance = parseFloat(sale.balance_remaining || 0)
				const maxAllowed = currentBalance + originalAmount
				if (amount > maxAllowed) {
					setError(`Amount cannot exceed remaining balance. Maximum allowed: $${maxAllowed.toLocaleString()}`)
					setLoading(false)
					return
				}
			}

			const paymentData = {
				payment_date: formData.payment_date,
				amount: amount,
				payment_method: formData.payment_method,
				reference_number: formData.reference_number.trim() || null,
				notes: formData.notes || null,
			}

			await updatePayment(id, paymentData)
			navigate('/payments')
		} catch (err) {
			console.error('Error updating payment:', err)
			setError(err.message || 'Failed to update payment. Please try again.')
			setLoading(false)
		}
	}

	const formatPaymentMethod = (method) => {
		if (!method) return 'Unknown'
		return method.split('_').map(word => 
			word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ')
	}

	if (loadingData) {
		return (
			<PageShell title="Edit Payment">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading payment...</p>
					</div>
				</div>
			</PageShell>
		)
	}

	if (!isAdmin) {
		return (
			<PageShell title="Edit Payment">
				<Card title="Access Denied">
					<div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
						Only administrators can edit payments.
					</div>
					<button
						onClick={() => navigate('/payments')}
						className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 active:bg-gray-100 sm:hover:bg-gray-50"
					>
						Back to Payments
					</button>
				</Card>
			</PageShell>
		)
	}

	return (
		<PageShell title="Edit Payment">
			<Card title="Payment details">
				{error && (
					<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				{sale && (
					<div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
						<p className="font-medium">Sale: {sale.contract_number || 'N/A'}</p>
						{sale.customers && (
							<p className="text-xs mt-1">
								Customer: {sale.customers.first_name} {sale.customers.last_name}
							</p>
						)}
						<p className="text-xs mt-1">
							Remaining Balance: ${parseFloat(sale.balance_remaining || 0).toLocaleString()}
						</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
					<Input
						label="Payment Date *"
						name="payment_date"
						type="date"
						value={formData.payment_date}
						onChange={handleChange}
						required
						disabled={loading}
					/>
					<Input
						label="Amount ($) *"
						name="amount"
						type="number"
						step="0.01"
						value={formData.amount}
						onChange={handleChange}
						placeholder="0.00"
						required
						disabled={loading}
						max={sale ? sale.balance_remaining : undefined}
					/>
					<Select
						label="Payment Method *"
						name="payment_method"
						value={formData.payment_method}
						onChange={handleChange}
						options={[
							{ value: 'cash', label: 'Cash' },
							{ value: 'bank_transfer', label: 'Bank Transfer' },
							{ value: 'mobile_money', label: 'Mobile Money' },
							{ value: 'cheque', label: 'Cheque' },
						]}
						required
						disabled={loading}
					/>
					<Input
						label="Reference Number (Optional)"
						name="reference_number"
						value={formData.reference_number}
						onChange={handleChange}
						placeholder="Transaction/Receipt number"
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
							{loading ? 'Updating...' : 'Update Payment'}
						</button>
						<button
							type="button"
							onClick={() => navigate('/payments')}
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

