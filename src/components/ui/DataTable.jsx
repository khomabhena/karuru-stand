import React, { useMemo, useState } from 'react'
import { Card } from './Card.jsx'
import { SearchBar } from './SearchBar.jsx'

export function DataTable({ title, columns, rows, searchableKeys = [], pageSize = 10, actions }) {
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(1)
	const [sort, setSort] = useState({ key: null, dir: 'asc' })

	const filtered = useMemo(() => {
		if (!search) return rows
		const q = search.toLowerCase()
		return rows.filter(row =>
			(searchableKeys.length ? searchableKeys : Object.keys(row)).some(k => String(row[k]).toLowerCase().includes(q))
		)
	}, [rows, search, searchableKeys])

	const sorted = useMemo(() => {
		if (!sort.key) return filtered
		const dir = sort.dir === 'asc' ? 1 : -1
		return [...filtered].sort((a, b) => (a[sort.key] > b[sort.key] ? dir : a[sort.key] < b[sort.key] ? -dir : 0))
	}, [filtered, sort])

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
	const current = useMemo(() => {
		const start = (page - 1) * pageSize
		return sorted.slice(start, start + pageSize)
	}, [sorted, page, pageSize])

	function onHeaderClick(key) {
		setPage(1)
		setSort(s => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
	}

	return (
		<Card
			title={title}
			actions={
				<div className="w-56">
					<SearchBar value={search} onChange={v => { setPage(1); setSearch(v) }} />
				</div>
			}
		>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[640px] text-left text-sm">
					<thead>
						<tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
							{columns.map(col => (
								<th key={col.key} className="cursor-pointer px-2 py-2" onClick={() => onHeaderClick(col.key)}>
									{col.header}
									{sort.key === col.key ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{current.map((row, idx) => (
							<tr key={idx} className="border-b border-slate-100 last:border-0">
								{columns.map(col => (
									<td key={col.key} className="px-2 py-2">
										{col.render ? col.render(row[col.key], row) : row[col.key]}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="mt-3 flex items-center justify-between text-sm">
				<div className="text-slate-500">
					Page {page} of {totalPages} • {sorted.length} items
				</div>
				<div className="flex items-center gap-2">
					<button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="rounded-lg px-2 py-1 disabled:opacity-50">
						Prev
					</button>
					<button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="rounded-lg px-2 py-1 disabled:opacity-50">
						Next
					</button>
				</div>
			</div>
		</Card>
	)
}


