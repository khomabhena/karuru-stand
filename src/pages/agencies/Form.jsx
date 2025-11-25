import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { getAgency, createAgency, updateAgency } from '../../lib/api/agencies.js'
import { theme } from '../../theme/colors.teal.js'

export default function AgencyForm() {
	const navigate = useNavigate()
	const { id } = useParams()
	const isEdit = !!id

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [formData, setFormData] = useState({
		name: '',
		contact_person: '',
		email: '',
		phone: '',
		address: '',
		commission_rate: '',
		is_active: true,
	})

	useEffect(() => {
		if (isEdit) {
			loadAgency()
		}
	}, [id])

	const loadAgency = async () => {
		try {
			setLoading(true)
			const agency = await getAgency(id)
			setFormData({
				name: agency.name || '',
				contact_person: agency.contact_person || '',
				email: agency.email || '',
				phone: agency.phone || '',
				address: agency.address || '',
				commission_rate: agency.commission_rate || '',
				is_active: agency.is_active ?? true,
			})
		} catch (err) {
			console.error('Error loading agency:', err)
			setError(err.message || 'Failed to load agency')
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			const data = {
				...formData,
				commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : 0,
			}

			if (isEdit) {
				await updateAgency(id, data)
			} else {
				await createAgency(data)
			}

			navigate('/agencies')
		} catch (err) {
			console.error('Error saving agency:', err)
			setError(err.message || 'Failed to save agency')
			setLoading(false)
		}
	}

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	return (
		<PageShell title={isEdit ? 'Edit Agency' : 'New Agency'}>
			<Card title="Agency details">
				{error && (
					<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
				)}

				<form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
					<Input
						label="Agency Name *"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
						disabled={loading}
					/>

					<Input
						label="Contact Person"
						name="contact_person"
						value={formData.contact_person}
						onChange={handleChange}
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

					<Input
						label="Phone"
						name="phone"
						type="tel"
						value={formData.phone}
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

					<Input
						label="Commission Rate (%) *"
						name="commission_rate"
						type="number"
						step="0.01"
						min="0"
						max="100"
						value={formData.commission_rate}
						onChange={handleChange}
						required
						disabled={loading}
					/>

					<div className="flex items-center">
						<input
							type="checkbox"
							name="is_active"
							id="is_active"
							checked={formData.is_active}
							onChange={handleChange}
							className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
							disabled={loading}
						/>
						<label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
							Active Agency
						</label>
					</div>

					<div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
						<button
							type="submit"
							disabled={loading}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-opacity active:opacity-80 ${
								loading ? 'opacity-50 cursor-not-allowed' : ''
							} ${theme.btnPrimary}`}
						>
							{loading ? 'Saving...' : isEdit ? 'Update Agency' : 'Create Agency'}
						</button>
						<button
							type="button"
							onClick={() => navigate('/agencies')}
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

