import React, { useState, useEffect } from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { useNavigate } from 'react-router-dom'
import { createSale, generateContractNumber } from '../../lib/api/sales.js'
import { getStands } from '../../lib/api/stands.js'
import { getCustomers } from '../../lib/api/customers.js'
import { getAgencies } from '../../lib/api/agencies.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import { theme } from '../../theme/colors.teal.js'

export default function NewSale() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [stands, setStands] = useState([])
	const [customers, setCustomers] = useState([])
	const [agencies, setAgencies] = useState([])
	
	const [formData, setFormData] = useState({
		stand_id: '',
		customer_id: '',
		agency_id: '',
		sale_date: new Date().toISOString().slice(0, 10),
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
	}, [])

	useEffect(() => {
		// Auto-generate contract number
		if (!formData.contract_number) {
			generateContractNumber().then(num => {
				setFormData(prev => ({ ...prev, contract_number: num }))
			}).catch(err => {
				console.error('Error generating contract number:', err)
			})
		}
	}, [])

	useEffect(() => {
		// Calculate balance when price or deposit changes
		if (formData.total_price && formData.deposit_amount) {
			const balance = parseFloat(formData.total_price) - parseFloat(formData.deposit_amount)
			setFormData(prev => ({ ...prev, balance_remaining: Math.max(0, balance).toFixed(2) }))
		}
	}, [formData.total_price, formData.deposit_amount])

	// When stand is selected, auto-fill price
	useEffect(() => {
		if (formData.stand_id) {
			const selectedStand = stands.find(s => s.id === formData.stand_id)
			if (selectedStand && !formData.total_price) {
				setFormData(prev => ({ ...prev, total_price: selectedStand.price.toString() }))
			}
		}
	}, [formData.stand_id, stands])

	const loadData = async () => {
		try {
			const [standsData, customersData, agenciesData] = await Promise.all([
				getStands(),
				getCustomers(),
				getAgencies()
			])
			
			// Only show available stands
			setStands(standsData.filter(s => s.status === 'available'))
			setCustomers(customersData)
			setAgencies(agenciesData.filter(a => a.is_active))
		} catch (err) {
			console.error('Error loading form data:', err)
			setError('Failed to load form data: ' + (err.message || 'Unknown error'))
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
			if (!formData.stand_id || !formData.customer_id || !formData.agency_id) {
				setError('Please select stand, customer, and agency')
				setLoading(false)
				return
			}

			if (!formData.total_price || !formData.deposit_amount) {
				setError('Please enter total price and deposit amount')
				setLoading(false)
				return
			}

			const deposit = parseFloat(formData.deposit_amount)
			const total = parseFloat(formData.total_price)

			if (deposit > total) {
				setError('Deposit cannot exceed total price')
				setLoading(false)
				return
			}

			const saleData = {
				stand_id: formData.stand_id,
				customer_id: formData.customer_id,
				agency_id: formData.agency_id,
				sale_date: formData.sale_date,
				contract_number: formData.contract_number,
				total_price: total,
				deposit_amount: deposit,
				balance_remaining: total - deposit,
				payment_plan: formData.payment_plan,
				status: deposit === total ? 'completed' : 'in_progress',
				notes: formData.notes || null,
				created_by: user?.id,
			}

			await createSale(saleData)
			
			// Update stand status to sold
			// Note: This would require updating the stand, but we'll handle that separately
			// For now, the sale is created successfully
			
			navigate('/sales')
		} catch (err) {
			console.error('Error creating sale:', err)
			setError(err.message || 'Failed to create sale. Please try again.')
			setLoading(false)
		}
	}

	return (
		<PageShell title="New Sale">
			<Card title="Sale details">
				{error && (
					<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{error}
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
						placeholder="Auto-generated"
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
						label="Deposit Amount ($) *"
						name="deposit_amount"
						type="number"
						step="0.01"
						value={formData.deposit_amount}
						onChange={handleChange}
						required
						disabled={loading}
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
							{loading ? 'Creating...' : 'Create Sale'}
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


