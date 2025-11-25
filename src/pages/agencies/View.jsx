import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { getAgency } from '../../lib/api/agencies.js'
import { useRole } from '../../hooks/useRole.js'
import { theme } from '../../theme/colors.teal.js'

export default function AgencyView() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { isAdmin } = useRole()
	const [agency, setAgency] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		loadAgency()
	}, [id])

	const loadAgency = async () => {
		try {
			setLoading(true)
			const data = await getAgency(id)
			setAgency(data)
			setError('')
		} catch (err) {
			console.error('Error loading agency:', err)
			setError(err.message || 'Failed to load agency')
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<PageShell title="Agency Details">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading agency...</p>
					</div>
				</div>
			</PageShell>
		)
	}

	if (error || !agency) {
		return (
			<PageShell title="Agency Details">
				<Card title="Error">
					<div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
						{error || 'Agency not found'}
					</div>
					<button
						onClick={() => navigate('/agencies')}
						className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 active:bg-gray-100 sm:hover:bg-gray-50"
					>
						Back to Agencies
					</button>
				</Card>
			</PageShell>
		)
	}

	return (
		<PageShell title="Agency Details">
			<Card title={agency.name}>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Badge color={agency.is_active ? 'success' : 'error'}>
							{agency.is_active ? 'Active' : 'Inactive'}
						</Badge>
						{isAdmin && (
							<button
								onClick={() => navigate(`/agencies/${agency.id}/edit`)}
								className={`rounded-lg px-4 py-2 text-sm font-medium ${theme.btnPrimary}`}
							>
								Edit Agency
							</button>
						)}
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Contact Person
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{agency.contact_person || 'N/A'}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Email
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{agency.email || 'N/A'}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Phone
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{agency.phone || 'N/A'}
							</p>
						</div>

						<div>
							<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
								Commission Rate
							</label>
							<p className="mt-1 text-sm text-gray-900">
								{agency.commission_rate ? `${agency.commission_rate}%` : 'N/A'}
							</p>
						</div>

						{agency.address && (
							<div className="sm:col-span-2">
								<label className="text-xs font-medium uppercase tracking-wide text-gray-500">
									Address
								</label>
								<p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
									{agency.address}
								</p>
							</div>
						)}
					</div>

					<div className="flex flex-col gap-3 pt-4 border-t border-gray-200 sm:flex-row">
						<button
							onClick={() => navigate('/agencies')}
							className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 active:bg-gray-100 sm:hover:bg-gray-50"
						>
							Back to Agencies
						</button>
					</div>
				</div>
			</Card>
		</PageShell>
	)
}

