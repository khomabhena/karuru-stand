import React from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../../theme/colors.teal.js'

export function ButtonLink({ to, children, variant = 'ghost', className = '', full = false }) {
	const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors'
	const variantClass = variant === 'primary' ? theme.btnPrimary : theme.btnGhost
	const width = full ? 'w-full' : ''
	return (
		<Link to={to} className={`${base} ${variantClass} ${width} ${className}`}>
			{children}
		</Link>
	)
}



