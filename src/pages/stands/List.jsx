import React, { useMemo, useState } from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { stands as data } from '../../data/stands.js'

export default function StandsList() {
	const [status, setStatus] = useState('All')
	const [agency, setAgency] = useState('All')

	const rows = useMemo(() => {
		return data.filter(r => (status === 'All' || r.status === status) && (agency === 'All' || r.agency === agency))
	}, [status, agency])

	const agencies = useMemo(() => ['All', ...Array.from(new Set(data.map(d => d.agency)))], [])
	const statuses = ['All', 'Available', 'Reserved', 'Sold']

	return (
		<PageShell title="Stands">
			<div className="mb-3 flex flex-wrap gap-2">
				<select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
					{statuses.map(s => (
						<option key={s}>{s}</option>
					))}
				</select>
				<select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={agency} onChange={e => setAgency(e.target.value)}>
					{agencies.map(a => (
						<option key={a}>{a}</option>
					))}
				</select>
			</div>

			<DataTable
				title="All Stands"
				searchableKeys={['code', 'agency', 'status']}
				columns={[
					{ key: 'code', header: 'Code' },
					{ key: 'size', header: 'Size (sqm)' },
					{ key: 'price', header: 'Price ($)', render: v => `$${v.toLocaleString()}` },
					{ key: 'status', header: 'Status', render: v => <Badge color={v === 'Available' ? 'success' : v === 'Reserved' ? 'warning' : 'neutral'}>{v}</Badge> },
					{ key: 'agency', header: 'Agency' },
					{ key: 'updated', header: 'Updated' }
				]}
				rows={rows}
			/>
		</PageShell>
	)
}


