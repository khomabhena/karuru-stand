import React from 'react'

export function Select({ label, value, onChange, options = [], name }) {
	return (
		<div>
			{label ? <label className="text-sm font-medium">{label}</label> : null}
			<select
				name={name}
				value={value}
				onChange={onChange}
				className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
			>
				{options.map(opt => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	)
}


