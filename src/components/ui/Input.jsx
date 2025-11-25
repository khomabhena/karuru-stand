import React from 'react'

export function Input({ label, value, onChange, placeholder, type = 'text', name, autoComplete, disabled, readOnly, className }) {
	return (
		<div>
			{label ? <label className="text-sm font-medium">{label}</label> : null}
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				autoComplete={autoComplete}
				disabled={disabled}
				readOnly={readOnly}
				className={`mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 ${
					disabled || readOnly ? 'bg-gray-50 cursor-not-allowed' : ''
				} ${className || ''}`}
			/>
		</div>
	)
}


