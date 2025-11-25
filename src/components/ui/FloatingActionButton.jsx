import React from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../../theme/colors.teal.js'

export function FloatingActionButton({ to, label, icon, className = '' }) {
	return (
		<Link
			to={to}
			className={`fixed bottom-20 right-4 z-30 flex items-center gap-2 rounded-full px-4 py-4 shadow-lg transition-transform active:scale-95 sm:hidden ${theme.btnPrimary} ${className}`}
			aria-label={label}
		>
			{icon || (
				<svg
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 4v16m8-8H4"
					/>
				</svg>
			)}
			{/* <span className="text-sm font-medium">{label}</span> */}
		</Link>
	)
}

