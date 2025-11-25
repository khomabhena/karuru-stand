import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { ButtonLink } from '../../components/ui/ButtonLink.jsx'
import { FloatingActionButton } from '../../components/ui/FloatingActionButton.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { useRole } from '../../hooks/useRole.js'
import { getAgencies, deleteAgency } from '../../lib/api/agencies.js'
import { theme } from '../../theme/colors.teal.js'

export default function AgenciesList() {
	const navigate = useNavigate()
	const { isAdmin } = useRole()
	const [agencies, setAgencies] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		loadAgencies()
	}, [])

	const loadAgencies = async () => {
		try {
			setLoading(true)
			const data = await getAgencies()
			setAgencies(data)
			setError('')
		} catch (err) {
			console.error('Error loading agencies:', err)
			setError(err.message || 'Failed to load agencies')
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id, name) => {
		if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
			return
		}

		try {
			await deleteAgency(id)
			await loadAgencies()
		} catch (err) {
			console.error('Error deleting agency:', err)
			alert('Failed to delete agency: ' + (err.message || 'Unknown error'))
		}
	}

	const formatCurrency = (value) => {
		if (!value) return 'N/A'
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(value)
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
		{ key: 'name', header: 'Agency Name' },
		{ key: 'contact_person', header: 'Contact Person' },
		{ key: 'email', header: 'Email' },
		{ key: 'phone', header: 'Phone' },
		{ key: 'commission_rate', header: 'Commission' },
		{ 
			key: 'is_active', 
			header: 'Status',
			render: (value, row) => (
				<Badge color={row.is_active ? 'success' : 'error'}>
					{row.is_active ? 'Active' : 'Inactive'}
				</Badge>
			)
		},
		{ key: 'actions', header: 'Actions' },
	]

	const rows = agencies.map((agency) => ({
		...agency,
		commission_rate: agency.commission_rate ? `${agency.commission_rate}%` : 'N/A',
		actions: (
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => navigate(`/agencies/${agency.id}`)}
					className="rounded px-2 py-1 text-sm text-teal-700 active:bg-teal-50 sm:hover:underline"
				>
					View
				</button>
				{isAdmin && (
					<>
						<button
							onClick={() => navigate(`/agencies/${agency.id}/edit`)}
							className="rounded px-2 py-1 text-sm text-blue-700 active:bg-blue-50 sm:hover:underline"
						>
							Edit
						</button>
						<button
							onClick={() => handleDelete(agency.id, agency.name)}
							className="rounded px-2 py-1 text-sm text-red-700 active:bg-red-50 sm:hover:underline"
						>
							Delete
						</button>
					</>
				)}
			</div>
		),
	}))

	return (
		<PageShell title="Agencies">
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-gray-600">
						Manage sales agencies and their commission rates
					</p>
				</div>
				{isAdmin && (
					<>
						<div className="hidden sm:block">
							<ButtonLink to="/agencies/new" className={theme.btnPrimary}>
								+ Add New Agency
							</ButtonLink>
						</div>
						<FloatingActionButton
							to="/agencies/new"
							label="Add Agency"
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
						<p className="text-gray-600">Loading agencies...</p>
					</div>
				</div>
			) : (
				<DataTable
					title=""
					searchableKeys={['name', 'contact_person', 'email', 'phone']}
					columns={columns}
					rows={rows}
				/>
			)}
		</PageShell>
	)
}
