import React from 'react'
import { Header } from '../../components/Header.jsx'
import { theme } from '../../theme/colors.teal.js'
import { BackButton } from '../../components/ui/BackButton.jsx'

export function PageShell({ title, subtitle = '', children }) {
	return (
		<div className={`min-h-screen ${theme.appBg} ${theme.text}`}>
			<Header title="Karuru" subtitle={subtitle || 'Stand management made simple'} />
			<main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-5 md:px-6 md:py-8">
				<div className="mb-3 flex items-center justify-between">
					<h2 className="text-base font-semibold tracking-tight sm:text-lg">{title}</h2>
					<BackButton />
				</div>
				{children}
			</main>
		</div>
	)
}

