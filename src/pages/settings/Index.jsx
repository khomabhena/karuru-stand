import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { BackButton } from '../../components/ui/BackButton.jsx'
import { useAuth } from '../../auth/AuthContext.jsx'
import { theme } from '../../theme/colors.teal.js'

export default function Settings() {
	const navigate = useNavigate()
	const { user, profile, signOut } = useAuth()

	const handleLogout = async () => {
		// signOut handles errors gracefully (including missing session)
		await signOut()
		// Always navigate after signOut (even if there was an error, local state is cleared)
		navigate('/signin', { replace: true })
	}

	return (
		<PageShell title="Settings">
			<BackButton to="/app" />

			<div className="mx-auto max-w-2xl space-y-6">
				{/* Profile Section */}
				<div className={`rounded-xl border p-6 ${theme.surface} ${theme.border}`}>
					<h2 className="mb-4 text-lg font-semibold text-gray-900">Profile</h2>
					<div className="space-y-3">
						<div>
							<label className="block text-sm font-medium text-gray-700">Full Name</label>
							<p className="mt-1 text-sm text-gray-900">{profile?.full_name || user?.email || 'N/A'}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<p className="mt-1 text-sm text-gray-900">{profile?.email || user?.email || 'N/A'}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Phone</label>
							<p className="mt-1 text-sm text-gray-900">{profile?.phone || 'N/A'}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Role</label>
							<p className="mt-1 text-sm text-gray-900 capitalize">
								{profile?.role?.replace('_', ' ') || 'N/A'}
							</p>
						</div>
					</div>
				</div>

				{/* Account Actions */}
				<div className={`rounded-xl border p-6 ${theme.surface} ${theme.border}`}>
					<h2 className="mb-4 text-lg font-semibold text-gray-900">Account</h2>
					<div className="space-y-3">
						<button
							onClick={handleLogout}
							className={`w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 ${theme.btnPrimary}`}
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</PageShell>
	)
}

