import React from 'react'
import { theme } from '../theme/colors.teal.js'

export function RecentActivity() {
	return (
		<div className={`rounded-xl border shadow-sm p-4 lg:col-span-2 ${theme.surface} ${theme.border}`}>
			<div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
				<h3 className="text-sm font-semibold">Recent Activity</h3>
				<button className={`text-sm inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 font-medium transition-colors ${theme.btnGhost} w-full sm:w-auto`}>
					View all
				</button>
			</div>
			<ul className="space-y-3">
				<li className={`flex items-center justify-between rounded-lg border p-3 ${theme.border}`}>
					<div>
						<p className="text-sm font-medium">Sale created • PLOT-045 to T. Ndlovu</p>
						<p className={`text-xs ${theme.mutedText}`}>By Agency A • Today, 09:14</p>
					</div>
					<span className={`rounded-full px-2 py-1 text-xs ${theme.pill.success}`}>Deposit $1,500</span>
				</li>
				<li className={`flex items-center justify-between rounded-lg border p-3 ${theme.border}`}>
					<div>
						<p className="text-sm font-medium">Payment recorded • Contract #KAR-2025-0112</p>
						<p className={`text-xs ${theme.mutedText}`}>By Agency B • Yesterday, 16:40</p>
					</div>
					<span className={`rounded-full px-2 py-1 text-xs ${theme.pill.info}`}>$800</span>
				</li>
				<li className={`flex items-center justify-between rounded-lg border p-3 ${theme.border}`}>
					<div>
						<p className="text-sm font-medium">Stand updated • PLOT-072 price changed</p>
						<p className={`text-xs ${theme.mutedText}`}>Admin • 2 days ago</p>
					</div>
					<span className={`rounded-full px-2 py-1 text-xs ${theme.pill.warning}`}>Now $8,900</span>
				</li>
			</ul>
		</div>
	)
}



