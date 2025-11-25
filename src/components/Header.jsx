import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { theme } from '../theme/colors.teal.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { SettingsModal } from './SettingsModal.jsx'
import { BackButton } from './ui/BackButton.jsx'

export function Header({ title, subtitle, pageTitle }) {
	const { user, profile } = useAuth()
	const navigate = useNavigate()
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)
	const settingsButtonRef = useRef(null)

	const displayName = profile?.full_name || user?.email || 'Guest'
	const role = profile?.role ? `(${profile.role.replace('_', ' ')})` : ''
	const agencyName = profile?.agencies?.name || null

	const initials =
		displayName !== 'Guest'
			? displayName
					.split(' ')
					.map((p) => p[0])
					.slice(0, 2)
					.join('')
					.toUpperCase()
			: 'G'

	return (
		<>
			<header className={`sticky top-0 z-10 ${theme.primaryBg} text-white`}>
				<div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4">
					<div className="min-w-0 flex-1">
						{pageTitle ? (
							<div className="flex items-center gap-2 sm:hidden">
								<button
									type="button"
									onClick={() => window.history.back()}
									className="inline-flex items-center justify-center rounded-lg p-1.5 text-white transition-colors active:bg-white/20"
									aria-label="Go back"
								>
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
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>
								<button
									onClick={() => navigate('/app')}
									className="text-lg font-semibold tracking-tight transition-opacity active:opacity-80 hover:opacity-90"
								>
									{pageTitle}
								</button>
							</div>
						) : null}
						<div className={pageTitle ? 'hidden sm:block' : ''}>
							{title ? (
								<button
									onClick={() => navigate('/app')}
									className="text-left text-lg font-semibold tracking-tight transition-opacity active:opacity-80 sm:text-xl hover:opacity-90"
								>
									{title}
								</button>
							) : null}
							{subtitle ? (
								<p className="mt-0.5 hidden text-xs text-white/80 sm:block sm:text-sm">{subtitle}</p>
							) : null}
						</div>
					</div>
					<div className="flex items-center gap-1.5 sm:gap-2">
						<div className="hidden text-right lg:block">
							<p className="text-xs uppercase tracking-wide text-white/70">
								Signed in
							</p>
							<p className="text-sm font-medium">
								{displayName}
								{role && (
									<span className="ml-1 text-white/70 text-xs">{role}</span>
								)}
							</p>
							{agencyName && (
								<p className="text-xs text-white/60 mt-0.5">
									{agencyName}
								</p>
							)}
						</div>
						<div className="h-8 w-8 select-none rounded-full bg-white/20 text-center text-xs leading-8 font-semibold sm:h-9 sm:w-9 sm:leading-9 sm:text-sm">
							{initials}
						</div>
						<div className="relative">
							<button
								ref={settingsButtonRef}
								onClick={() => setIsSettingsOpen(!isSettingsOpen)}
								className="inline-flex items-center justify-center rounded-lg p-1.5 text-white transition-colors active:bg-white/20 sm:p-2 sm:hover:bg-white/10"
								title="Settings"
								aria-label="Settings"
								aria-expanded={isSettingsOpen}
							>
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
										d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			<SettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
				buttonRef={settingsButtonRef}
			/>
		</>
	)
}
