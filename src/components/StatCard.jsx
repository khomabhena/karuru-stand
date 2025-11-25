import React from 'react'
import { theme } from '../theme/colors.teal.js'

export function StatCard({ label, value, helper, accent }) {
	const dot =
		accent === 'success'
			? theme.accent.success
			: accent === 'info'
			? theme.accent.info
			: accent === 'warning'
			? theme.accent.warning
			: accent === 'error'
			? theme.accent.error
			: accent === 'accent3'
			? theme.accent.accent3
			: theme.accent.accent2
	const tint =
		accent === 'success'
			? 'bg-green-50'
			: accent === 'info'
			? 'bg-cyan-50'
			: accent === 'warning'
			? 'bg-amber-50'
			: accent === 'error'
			? 'bg-red-50'
			: 'bg-teal-50'
	const borderAccent =
		accent === 'success'
			? 'border-green-500'
			: accent === 'info'
			? 'border-cyan-500'
			: accent === 'warning'
			? 'border-amber-500'
			: accent === 'error'
			? 'border-red-500'
			: 'border-teal-500'
	const valueColor =
		accent === 'success'
			? 'text-green-700'
			: accent === 'info'
			? 'text-cyan-700'
			: accent === 'warning'
			? 'text-amber-700'
			: accent === 'error'
			? 'text-red-700'
			: 'text-teal-700'
	const shadowClass = 'shadow-lg shadow-[0_8px_24px_rgba(13,148,136,0.25)]'
	return (
		<div className={`rounded-xl border ${shadowClass} p-3 sm:p-4 ${theme.border} ${tint} border-l-4 ${borderAccent}`}>
			<div className="flex items-center justify-between">
				<p className={`text-xs sm:text-xs font-medium uppercase tracking-wide ${theme.mutedText}`}>{label}</p>
				<div className={`h-2 w-2 rounded-full ${dot.split(' ')[0]}`} />
			</div>
			<div className={`mt-2 text-xl sm:text-2xl font-semibold tracking-tight ${valueColor}`}>{value}</div>
			{helper ? <div className={`mt-1 text-xs ${theme.mutedText}`}>{helper}</div> : null}
		</div>
	)
}


