import React from 'react'
import { StatCard } from './StatCard.jsx'

export function StatsGrid() {
	return (
		<section className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
			<StatCard label="Total Stands" value="128" helper="82 available" accent="accent2" />
			<StatCard label="Sales (This Month)" value="24" helper="+12% vs last month" accent="accent2" />
			<StatCard label="Revenue Collected" value="$72,400" helper="This month" accent="accent2" />
			<StatCard label="Outstanding Balance" value="$153,900" helper="Across 41 sales" accent="accent2" />
		</section>
	)
}



