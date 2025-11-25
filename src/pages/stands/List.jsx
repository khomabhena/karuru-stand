import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { ButtonLink } from '../../components/ui/ButtonLink.jsx'
import { FloatingActionButton } from '../../components/ui/FloatingActionButton.jsx'
import { useRole } from '../../hooks/useRole.js'
import { getStands, deleteStand } from '../../lib/api/stands.js'
import { theme } from '../../theme/colors.teal.js'
import { SEO } from '../../components/SEO.jsx'

export default function StandsList() {
	const navigate = useNavigate()
	const { canManageStands } = useRole()
	const [stands, setStands] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [status, setStatus] = useState('All')

	useEffect(() => {
		loadStands()
	}, [])

	const loadStands = async () => {
		try {
			setLoading(true)
			const data = await getStands()
			setStands(data)
			setError('')
		} catch (err) {
			console.error('Error loading stands:', err)
			setError(err.message || 'Failed to load stands')
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this stand?')) {
			return
		}

		try {
			await deleteStand(id)
			await loadStands()
		} catch (err) {
			console.error('Error deleting stand:', err)
			alert('Failed to delete stand: ' + (err.message || 'Unknown error'))
		}
	}

	const getStatusColor = (status) => {
		switch (status) {
			case 'available': return 'success'
			case 'reserved': return 'warning'
			case 'sold': return 'neutral'
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

	const statuses = ['All', 'available', 'reserved', 'sold', 'cancelled']

	const filteredStands = useMemo(() => {
		if (status === 'All') return stands
		return stands.filter(s => s.status === status)
	}, [stands, status])

	const columns = [
		{ key: 'stand_number', header: 'Stand Number' },
		{ key: 'area_sqm', header: 'Area (sqm)' },
		{ key: 'location', header: 'Location' },
		{ key: 'price', header: 'Price' },
		{ 
			key: 'status', 
			header: 'Status',
			render: (value) => (
				<Badge color={getStatusColor(value)}>
					{value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'}
				</Badge>
			)
		},
		{ key: 'updated_at', header: 'Updated' },
		{ key: 'actions', header: 'Actions' },
	]

	const rows = filteredStands.map((stand) => ({
		...stand,
		price: `$${parseFloat(stand.price || 0).toLocaleString()}`,
		area_sqm: parseFloat(stand.area_sqm || 0).toLocaleString(),
		updated_at: formatDate(stand.updated_at),
		actions: canManageStands ? (
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => navigate(`/stands/${stand.id}/edit`)}
					className="rounded px-2 py-1 text-sm text-blue-700 active:bg-blue-50 sm:hover:underline"
				>
					Edit
				</button>
				<button
					onClick={() => handleDelete(stand.id)}
					className="rounded px-2 py-1 text-sm text-red-700 active:bg-red-50 sm:hover:underline"
				>
					Delete
				</button>
			</div>
		) : null,
	}))

	return (
		<>
			<SEO 
				title="Stands"
				description="Manage your stand inventory. View available, sold, and reserved stands with detailed information about area, location, and pricing."
				url="https://karuru-stand.vercel.app/stands"
			/>
			<PageShell title="Stands">
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-600">
						Manage stand inventory and availability
					</p>
				</div>
				{canManageStands && (
					<>
						<div className="hidden sm:block">
							<ButtonLink to="/stands/new" className={theme.btnPrimary}>
								+ Add New Stand
							</ButtonLink>
						</div>
						<FloatingActionButton
							to="/stands/new"
							label="Add Stand"
						/>
					</>
				)}
			</div>

			{error && (
				<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}

			<div className="mb-3 flex flex-wrap gap-2">
				<select
					className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
					value={status}
					onChange={e => setStatus(e.target.value)}
				>
					{statuses.map(s => (
						<option key={s} value={s}>
							{s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
						</option>
					))}
				</select>
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading stands...</p>
					</div>
				</div>
			) : (
				<DataTable
					title=""
					searchableKeys={['stand_number', 'location', 'status']}
					columns={columns}
					rows={rows}
				/>
			)}
		</PageShell>
		</>
	)
}


