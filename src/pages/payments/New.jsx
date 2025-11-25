import React, { useState, useEffect } from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createPayment } from '../../lib/api/payments.js'
import { getSalesWithBalance } from '../../lib/api/payments.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { theme } from '../../theme/colors.teal.js'

export default function NewPayment() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const { user } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [sales, setSales] = useState([])
	const [selectedSale, setSelectedSale] = useState(null)
	
	// Get sale_id from URL query parameter if present
	const saleIdFromUrl = searchParams.get('sale_id') || ''
	
	const [formData, setFormData] = useState({
		sale_id: saleIdFromUrl,
		payment_date: new Date().toISOString().slice(0, 10),
		amount: '',
		payment_method: 'cash',
		reference_number: '', // Will be auto-generated if left empty
		notes: '',
	})

	useEffect(() => {
		loadSales()
	}, [])

	useEffect(() => {
		// Update selected sale when sale_id changes
		if (formData.sale_id) {
			const sale = sales.find(s => s.id === formData.sale_id)
			setSelectedSale(sale)
		} else {
			setSelectedSale(null)
		}
	}, [formData.sale_id, sales])

	const loadSales = async () => {
		try {
			const data = await getSalesWithBalance()
			setSales(data)
		} catch (err) {
			console.error('Error loading sales:', err)
			setError('Failed to load sales: ' + (err.message || 'Unknown error'))
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
			if (!formData.sale_id) {
				setError('Please select a sale')
				setLoading(false)
				return
			}

			if (!formData.amount || parseFloat(formData.amount) <= 0) {
				setError('Please enter a valid payment amount')
				setLoading(false)
				return
			}

			const amount = parseFloat(formData.amount)
			const balance = parseFloat(selectedSale?.balance_remaining || 0)

			if (amount > balance) {
				setError(`Amount cannot exceed remaining balance of $${balance.toLocaleString()}`)
				setLoading(false)
				return
			}

			const paymentData = {
				sale_id: formData.sale_id,
				payment_date: formData.payment_date,
				amount: amount,
				payment_method: formData.payment_method,
				reference_number: formData.reference_number.trim() || null, // Auto-generated if empty
				notes: formData.notes || null,
				created_by: user?.id,
			}

			await createPayment(paymentData)
			navigate('/payments')
		} catch (err) {
			console.error('Error creating payment:', err)
			setError(err.message || 'Failed to record payment. Please try again.')
			setLoading(false)
		}
	}

	const formatSaleOption = (sale) => {
		const customer = sale.customers 
			? `${sale.customers.first_name} ${sale.customers.last_name}`
			: 'Unknown'
		const balance = parseFloat(sale.balance_remaining || 0).toLocaleString()
		return `${sale.contract_number} - ${customer} (Balance: $${balance})`
	}

	return (
		<PageShell title="Record Payment">
			<Card title="Payment details">
				{error && (
					<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				{sales.length === 0 && !error && (
					<div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
						No sales with outstanding balances found.
					</div>
				)}

				{selectedSale && (
					<div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
						<p className="font-medium">Remaining Balance: ${parseFloat(selectedSale.balance_remaining || 0).toLocaleString()}</p>
						<p className="text-xs mt-1">Total Price: ${parseFloat(selectedSale.total_price || 0).toLocaleString()}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
					<Select
						label="Sale (Contract) *"
						name="sale_id"
						value={formData.sale_id}
						onChange={handleChange}
						options={sales.map(sale => ({ 
							value: sale.id, 
							label: formatSaleOption(sale)
						}))}
						required
						disabled={loading || sales.length === 0}
					/>
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
						max={selectedSale ? selectedSale.balance_remaining : undefined}
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
						placeholder="Leave empty to auto-generate (Trx-xxx-xxxxx-xxxx)"
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
							disabled={loading || sales.length === 0}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-opacity active:opacity-80 ${
								loading || sales.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
							} ${theme.btnPrimary}`}
						>
							{loading ? 'Recording...' : 'Record Payment'}
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


