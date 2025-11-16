import React from 'react'
import { theme } from '../../theme/colors.teal.js'

export function Card({ title, actions, children, className = '' }) {
	return (
		<div className={`rounded-xl border shadow-sm p-4 ${theme.surface} ${theme.border} ${className}`}>
			{title || actions ? (
				<div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
					{title ? <h3 className="text-sm font-semibold">{title}</h3> : <div />}
					{actions ? <div className="flex items-center gap-2">{actions}</div> : null}
				</div>
			) : null}
			{children}
		</div>
	)
}


