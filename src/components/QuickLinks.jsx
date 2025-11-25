import React from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../theme/colors.teal.js'
import { ButtonLink } from './ui/ButtonLink.jsx'
import { useRole } from '../hooks/useRole.js'

export function QuickLinks() {
	const { isAdmin, canCreateSales } = useRole()

	return (
		<div className={`hidden rounded-xl border shadow-sm p-4 sm:block ${theme.surface} ${theme.border}`}>
			<h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
			<nav className="grid gap-2.5 sm:gap-3">
				{/* Stands */}
				<div className="flex items-center justify-between gap-2">
					<ButtonLink to="/stands" className="flex-1 justify-center sm:justify-start px-3 py-2">
						Stands
					</ButtonLink>
					{isAdmin && (
						<Link
							to="/stands/new"
							className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-colors active:opacity-80 ${theme.btnPrimary}`}
							title="Add New Stand"
						>
							+
						</Link>
					)}
				</div>

				{/* Agencies */}
				<div className="flex items-center justify-between gap-2">
					<ButtonLink to="/agencies" className="flex-1 justify-center sm:justify-start px-3 py-2">
						Agencies
					</ButtonLink>
					{isAdmin && (
						<Link
							to="/agencies/new"
							className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-colors active:opacity-80 ${theme.btnPrimary}`}
							title="Add New Agency"
						>
							+
						</Link>
					)}
				</div>

				{/* Customers */}
				<div className="flex items-center justify-between gap-2">
					<ButtonLink to="/customers" className="flex-1 justify-center sm:justify-start px-3 py-2">
						Customers
					</ButtonLink>
					{(isAdmin || canCreateSales) && (
						<Link
							to="/customers/new"
							className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-colors active:opacity-80 ${theme.btnPrimary}`}
							title="Add New Customer"
						>
							+
						</Link>
					)}
				</div>

				{/* Sales */}
				<div className="flex items-center justify-between gap-2">
					<ButtonLink to="/sales" className="flex-1 justify-center sm:justify-start px-3 py-2">
						Sales
					</ButtonLink>
					{canCreateSales && (
						<Link
							to="/sales/new"
							className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-colors active:opacity-80 ${theme.btnPrimary}`}
							title="Create New Sale"
						>
							+
						</Link>
					)}
				</div>

				{/* Payments */}
				<div className="flex items-center justify-between gap-2">
					<ButtonLink to="/payments" className="flex-1 justify-center sm:justify-start px-3 py-2">
						Payments
					</ButtonLink>
					{canCreateSales && (
						<Link
							to="/payments/new"
							className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-colors active:opacity-80 ${theme.btnPrimary}`}
							title="Record New Payment"
						>
							+
						</Link>
					)}
				</div>

				{/* Reports - No add button */}
				<ButtonLink to="/reports" className="justify-center sm:justify-start px-3 py-2">
					Reports
				</ButtonLink>

				{/* Users - Admin only */}
				{isAdmin && (
					<ButtonLink to="/users" className="justify-center sm:justify-start px-3 py-2">
						Users
					</ButtonLink>
				)}
			</nav>
		</div>
	)
}



