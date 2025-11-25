import React from 'react'
import { Header } from './components/Header.jsx'
import { OverviewActions } from './components/OverviewActions.jsx'
import { StatsGrid } from './components/StatsGrid.jsx'
import { RecentActivity } from './components/RecentActivity.jsx'
import { QuickLinks } from './components/QuickLinks.jsx'
import { BottomNav } from './components/BottomNav.jsx'
import { theme } from './theme/colors.teal.js'
import { SEO } from './components/SEO.jsx'

export default function App() {
	return (
		<>
			<SEO 
				title="Dashboard"
				description="View your stand management dashboard with key metrics, recent activity, and quick access to all features."
				url="https://karuru-stand.vercel.app/app"
			/>
			<div className={`min-h-screen ${theme.appBg} ${theme.text}`}>
				<Header title="Karuru" subtitle="Stand management made simple" />
			<main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-5 sm:pb-6 md:px-6 md:py-8">
				<OverviewActions />

				<StatsGrid />

				<section className="mt-6 grid gap-4 lg:grid-cols-3">
					<RecentActivity />
					<QuickLinks />
				</section>
			</main>
			<BottomNav />
		</div>
		</>
	)
}


