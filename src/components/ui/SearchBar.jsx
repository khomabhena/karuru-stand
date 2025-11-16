import React from 'react'

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
	return (
		<input
			type="text"
			value={value}
			onChange={e => onChange(e.target.value)}
			placeholder={placeholder}
			className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
		/>
	)
}


