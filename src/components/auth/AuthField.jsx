import React from 'react'

export function AuthField({ label, type = 'text', value, onChange, placeholder, required = true, name, autoComplete }) {
	return (
		<div>
			<label className="text-sm font-medium">{label}</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				autoComplete={autoComplete}
				required={required}
				className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
			/>
		</div>
	)
}



