import React from 'react'
import { Header } from '../../components/Header.jsx'
import { BottomNav } from '../../components/BottomNav.jsx'
import { theme } from '../../theme/colors.teal.js'
import { BackButton } from '../../components/ui/BackButton.jsx'

export function PageShell({ title, subtitle = '', children }) {
	return (
		<div className={`min-h-screen ${theme.appBg} ${theme.text}`}>
			<Header title="Karuru" subtitle={subtitle || 'Stand management made simple'} pageTitle={title} />
			<main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-5 sm:pb-6 md:px-6 md:py-8">
				<div className="mb-3 hidden items-center justify-between sm:flex">
					<h2 className="text-base font-semibold tracking-tight sm:text-lg">{title}</h2>
					<BackButton />
				</div>
				{children}
			</main>
			<BottomNav />
		</div>
	)
}

