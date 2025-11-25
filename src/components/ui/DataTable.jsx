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
				<div className="w-full sm:w-56">
					<SearchBar value={search} onChange={v => { setPage(1); setSearch(v) }} />
				</div>
			}
		>
			{/* Mobile Card View */}
			<div className="block sm:hidden">
				{current.map((row, idx) => {
					const actionsCol = columns.find((col) => col.key === 'actions')
					const originalRow = rows.find((r, i) => {
						// Find the original row data (before mapping)
						const rowIndex = (page - 1) * pageSize + idx
						return i === rowIndex
					}) || row
					
					// Separate fields: primary (important) and secondary (less important)
					const allFields = columns.filter(col => col.key !== 'actions')
					const secondaryKeys = ['updated', 'created', 'created_at', 'updated_at']
					const primaryFields = allFields.filter(col => !secondaryKeys.includes(col.key.toLowerCase()))
					const secondaryFields = allFields.filter(col => secondaryKeys.includes(col.key.toLowerCase()))
					
					return (
						<div key={idx} className="mb-2.5 rounded-lg border border-gray-200 bg-white p-2.5 last:mb-0">
							{/* Primary info in compact 2-column grid */}
							<div className="mb-2 grid grid-cols-2 gap-x-2 gap-y-1.5">
								{primaryFields.map((col) => {
									const value = row[col.key]
									return (
										<div key={col.key} className="min-w-0">
											<div className="text-[10px] font-medium uppercase tracking-wide text-gray-400 truncate">{col.header}</div>
											<div className="text-sm font-medium text-gray-900 truncate">
												{col.render ? col.render(value, originalRow) : String(value || 'N/A')}
											</div>
										</div>
									)
								})}
							</div>
							
							{/* Secondary info in a compact horizontal row */}
							{secondaryFields.length > 0 && (
								<div className="mb-2 flex flex-wrap gap-x-3 gap-y-0.5 border-t border-gray-100 pt-1.5">
									{secondaryFields.map((col) => {
										const value = row[col.key]
										return (
											<div key={col.key} className="flex items-center gap-1">
												<span className="text-[10px] font-medium text-gray-400">{col.header}:</span>
												<span className="text-xs text-gray-600">
													{col.render ? col.render(value, originalRow) : String(value || 'N/A')}
												</span>
											</div>
										)
									})}
								</div>
							)}
							
							{/* Actions */}
							{actionsCol && row.actions && (
								<div className="flex gap-2 border-t border-gray-100 pt-2">
									{row.actions}
								</div>
							)}
						</div>
					)
				})}
			</div>

			{/* Desktop Table View */}
			<div className="hidden overflow-x-auto sm:block">
				<table className="w-full text-left text-sm">
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
			<div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
				<div className="text-slate-500 text-center sm:text-left">
					Page {page} of {totalPages} • {sorted.length} items
				</div>
				<div className="flex items-center justify-center gap-2">
					<button 
						disabled={page <= 1} 
						onClick={() => setPage(p => Math.max(1, p - 1))} 
						className="rounded-lg px-4 py-2 disabled:opacity-50 active:bg-gray-100 sm:px-2 sm:py-1"
					>
						Prev
					</button>
					<button 
						disabled={page >= totalPages} 
						onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
						className="rounded-lg px-4 py-2 disabled:opacity-50 active:bg-gray-100 sm:px-2 sm:py-1"
					>
						Next
					</button>
				</div>
			</div>
		</Card>
	)
}


