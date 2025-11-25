import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { getCustomer, createCustomer, updateCustomer, checkDuplicateIdNumber } from '../../lib/api/customers.js'
import { theme } from '../../theme/colors.teal.js'

export default function CustomerForm() {
	const navigate = useNavigate()
	const { id } = useParams()
	const isEdit = !!id

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [duplicateWarning, setDuplicateWarning] = useState(null)
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		id_number: '',
		email: '',
		phone: '',
		address: '',
		notes: '',
	})

	useEffect(() => {
		if (isEdit) {
			loadCustomer()
		}
	}, [id])

	const loadCustomer = async () => {
		try {
			setLoading(true)
			const customer = await getCustomer(id)
			setFormData({
				first_name: customer.first_name || '',
				last_name: customer.last_name || '',
				id_number: customer.id_number || '',
				email: customer.email || '',
				phone: customer.phone || '',
				address: customer.address || '',
				notes: customer.notes || '',
			})
		} catch (err) {
			console.error('Error loading customer:', err)
			setError(err.message || 'Failed to load customer')
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			// Check for duplicate ID number before submitting
			if (formData.id_number && formData.id_number.trim() !== '') {
				const duplicate = await checkDuplicateIdNumber(formData.id_number, isEdit ? id : null)
				if (duplicate) {
					setError(`A customer with ID number "${formData.id_number}" already exists: ${duplicate.first_name} ${duplicate.last_name}. Please use a different ID number or update the existing customer.`)
					setLoading(false)
					return
				}
			}

			if (isEdit) {
				await updateCustomer(id, formData)
			} else {
				await createCustomer(formData)
			}

			navigate('/customers')
		} catch (err) {
			console.error('Error saving customer:', err)
			// Check if error is due to unique constraint violation
			if (err.message?.includes('duplicate') || err.message?.includes('unique') || err.code === '23505') {
				setError('A customer with this ID number already exists. Please use a different ID number.')
			} else {
				setError(err.message || 'Failed to save customer')
			}
			setLoading(false)
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))

		// Check for duplicate ID number when ID number field changes
		if (name === 'id_number' && value.trim() !== '') {
			checkDuplicateIdNumber(value, isEdit ? id : null)
				.then((duplicate) => {
					if (duplicate) {
						setDuplicateWarning({
							message: `A customer with ID number "${value}" already exists: ${duplicate.first_name} ${duplicate.last_name}`,
							customer: duplicate
						})
					} else {
						setDuplicateWarning(null)
					}
				})
				.catch((err) => {
					console.error('Error checking duplicate:', err)
					// Don't show error to user, just log it
				})
		} else if (name === 'id_number' && value.trim() === '') {
			setDuplicateWarning(null)
		}
	}

	return (
		<PageShell title={isEdit ? 'Edit Customer' : 'New Customer'}>
			<Card title="Customer details">
				{error && (
					<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
				)}

				{duplicateWarning && !error && (
					<div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
						<p className="font-medium">⚠️ Duplicate ID Number Detected</p>
						<p className="mt-1">{duplicateWarning.message}</p>
						{duplicateWarning.customer && (
							<button
								type="button"
								onClick={() => navigate(`/customers/${duplicateWarning.customer.id}`)}
								className="mt-2 text-xs font-medium text-amber-800 underline hover:text-amber-900"
							>
								View existing customer →
							</button>
						)}
					</div>
				)}

				<form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
					<Input
						label="First Name *"
						name="first_name"
						value={formData.first_name}
						onChange={handleChange}
						required
						disabled={loading}
					/>

					<Input
						label="Last Name *"
						name="last_name"
						value={formData.last_name}
						onChange={handleChange}
						required
						disabled={loading}
					/>

					<Input
						label="ID Number"
						name="id_number"
						value={formData.id_number}
						onChange={handleChange}
						placeholder="National ID number"
						disabled={loading}
					/>

					<Input
						label="Phone *"
						name="phone"
						type="tel"
						value={formData.phone}
						onChange={handleChange}
						required
						disabled={loading}
					/>

					<Input
						label="Email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						disabled={loading}
					/>

					<div className="sm:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Address
						</label>
						<textarea
							name="address"
							value={formData.address}
							onChange={handleChange}
							rows={3}
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
							disabled={loading}
						/>
					</div>

					<div className="sm:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Notes
						</label>
						<textarea
							name="notes"
							value={formData.notes}
							onChange={handleChange}
							rows={3}
							placeholder="Additional customer information..."
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
							{loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
						</button>
						<button
							type="button"
							onClick={() => navigate('/customers')}
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

