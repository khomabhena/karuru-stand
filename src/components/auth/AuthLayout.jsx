import React from 'react'
import { theme } from '../../theme/colors.teal.js'

export function AuthLayout({ title, subtitle, children, footer }) {
	return (
		<div className={`min-h-screen ${theme.appBg} ${theme.text} flex items-center justify-center p-4`}>
			<div className={`w-full max-w-sm rounded-xl border shadow-sm p-6 ${theme.surface} ${theme.border}`}>
				{title ? <h1 className="text-lg font-semibold tracking-tight">{title}</h1> : null}
				{subtitle ? <p className={`mt-1 text-sm ${theme.mutedText}`}>{subtitle}</p> : null}
				<div className="mt-4">{children}</div>
				{footer ? <div className="mt-4">{footer}</div> : null}
			</div>
		</div>
	)
}



