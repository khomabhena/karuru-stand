import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { getStand, updateStand } from '../../lib/api/stands.js'
import { theme } from '../../theme/colors.teal.js'

export default function EditStand() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [standNumber, setStandNumber] = useState('')
	const [areaSqm, setAreaSqm] = useState('')
	const [location, setLocation] = useState('')
	const [price, setPrice] = useState('')
	const [status, setStatus] = useState('available')
	const [description, setDescription] = useState('')
	const [loading, setLoading] = useState(false)
	const [loadingData, setLoadingData] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		loadStand()
	}, [id])

	const loadStand = async () => {
		try {
			setLoadingData(true)
			const stand = await getStand(id)
			setStandNumber(stand.stand_number || '')
			setAreaSqm(stand.area_sqm?.toString() || '')
			setLocation(stand.location || '')
			setPrice(stand.price?.toString() || '')
			setStatus(stand.status || 'available')
			setDescription(stand.description || '')
			setError('')
		} catch (err) {
			console.error('Error loading stand:', err)
			setError(err.message || 'Failed to load stand')
		} finally {
			setLoadingData(false)
		}
	}

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			// Validate required fields
			if (!standNumber || !areaSqm || !location || !price) {
				setError('Please fill in all required fields')
				setLoading(false)
				return
			}

			const standData = {
				stand_number: standNumber,
				area_sqm: parseFloat(areaSqm),
				location: location,
				price: parseFloat(price),
				status: status,
				description: description || null,
			}

			await updateStand(id, standData)
			navigate('/stands')
		} catch (err) {
			console.error('Error updating stand:', err)
			setError(err.message || 'Failed to update stand. Please try again.')
			setLoading(false)
		}
	}

	if (loadingData) {
		return (
			<PageShell title="Edit Stand">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading stand...</p>
					</div>
				</div>
			</PageShell>
		)
	}

	return (
		<PageShell title="Edit Stand">
			<Card title="Stand details">
				{error && (
					<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{error}
					</div>
				)}

				<form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
					<Input
						label="Stand Number"
						value={standNumber}
						onChange={e => setStandNumber(e.target.value)}
						placeholder="PLOT-123"
						required
						disabled={loading}
					/>
					<Input
						label="Area (sqm)"
						value={areaSqm}
						onChange={e => setAreaSqm(e.target.value)}
						placeholder="300"
						type="number"
						step="0.01"
						required
						disabled={loading}
					/>
					<Input
						label="Location"
						value={location}
						onChange={e => setLocation(e.target.value)}
						placeholder="Street/Area name"
						required
						disabled={loading}
					/>
					<Input
						label="Price"
						value={price}
						onChange={e => setPrice(e.target.value)}
						placeholder="7500"
						type="number"
						step="0.01"
						required
						disabled={loading}
					/>
					<Select
						label="Status"
						value={status}
						onChange={e => setStatus(e.target.value)}
						options={[
							{ value: 'available', label: 'Available' },
							{ value: 'reserved', label: 'Reserved' },
							{ value: 'sold', label: 'Sold' },
							{ value: 'cancelled', label: 'Cancelled' },
						]}
						disabled={loading}
					/>
					<div className="sm:col-span-2">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Description
						</label>
						<textarea
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder="Additional details about the stand..."
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
							rows={3}
							disabled={loading}
						/>
					</div>
					<div className="sm:col-span-2 flex gap-3">
						<button
							type="submit"
							disabled={loading}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-opacity ${
								loading ? 'opacity-50 cursor-not-allowed' : ''
							} ${theme.btnPrimary}`}
						>
							{loading ? 'Updating...' : 'Update Stand'}
						</button>
						<button
							type="button"
							onClick={() => navigate('/stands')}
							disabled={loading}
							className={`rounded-lg px-4 py-2 text-sm font-medium ${theme.btnGhost}`}
						>
							Cancel
						</button>
					</div>
				</form>
			</Card>
		</PageShell>
	)
}


