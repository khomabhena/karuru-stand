import React from 'react'

const colorMap = {
	neutral: 'bg-slate-100 text-slate-700',
	success: 'bg-green-50 text-green-700',
	info: 'bg-cyan-50 text-cyan-700',
	warning: 'bg-amber-50 text-amber-700',
	error: 'bg-red-50 text-red-700'
}

export function Badge({ children, color = 'neutral' }) {
	const cls = colorMap[color] || colorMap.neutral
	return <span className={`rounded-full px-2 py-1 text-xs ${cls}`}>{children}</span>
}


