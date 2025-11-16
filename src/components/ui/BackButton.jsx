import React from 'react'
import { useNavigate } from 'react-router-dom'

export function BackButton({ to, label = 'Back' }) {
	const navigate = useNavigate()
	return (
		<button
			type="button"
			onClick={() => (to ? navigate(to) : navigate(-1))}
			className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
		>
			<span aria-hidden="true">←</span>
			{label}
		</button>
	)
}


