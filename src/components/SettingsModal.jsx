import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { theme } from '../theme/colors.teal.js'

export function SettingsModal({ isOpen, onClose, buttonRef }) {
	const navigate = useNavigate()
	const { user, profile, signOut } = useAuth()
	const dropdownRef = useRef(null)

	const handleLogout = async () => {
		onClose()
		const { error } = await signOut()
		if (!error) {
			// Use replace to prevent going back to dashboard
			navigate('/signin', { replace: true })
		}
	}

	// Close on outside click
	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				buttonRef?.current &&
				!buttonRef.current.contains(event.target)
			) {
				onClose()
			}
		}

		// Close on escape key
		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscape)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose, buttonRef])

	// Position dropdown below button
	useEffect(() => {
		if (!isOpen || !buttonRef?.current || !dropdownRef.current) return

		const button = buttonRef.current
		const dropdown = dropdownRef.current
		const rect = button.getBoundingClientRect()
		const isMobile = window.innerWidth < 640

		if (isMobile) {
			// Full width on mobile, positioned at top right
			dropdown.style.top = '60px'
			dropdown.style.right = '12px'
			dropdown.style.left = '12px'
			dropdown.style.width = 'auto'
		} else {
			// Position below and align to right on desktop
			dropdown.style.top = `${rect.bottom + 8}px`
			dropdown.style.right = `${window.innerWidth - rect.right}px`
			dropdown.style.left = 'auto'
			dropdown.style.width = '320px'
		}
	}, [isOpen, buttonRef])

	if (!isOpen) return null

	return (
		<>
			{/* Backdrop for mobile */}
			<div
				className="fixed inset-0 z-40 bg-black/20 md:hidden"
				onClick={onClose}
			/>

			{/* Dropdown Menu */}
			<div
				ref={dropdownRef}
				className={`fixed z-50 rounded-lg border bg-white shadow-xl sm:w-80 ${theme.border}`}
				style={{
					position: 'fixed',
				}}
			>
				{/* Header */}
				<div className={`border-b px-4 py-3 ${theme.border}`}>
					<h2 className="text-sm font-semibold text-gray-900">Settings</h2>
				</div>

				{/* Content */}
				<div className="max-h-[60vh] overflow-y-auto">
					{/* Profile Section */}
					<div className={`border-b px-4 py-3 ${theme.border}`}>
						<div className="space-y-2.5">
							<div>
								<label className="block text-xs font-medium text-gray-500">Full Name</label>
								<p className="mt-0.5 text-sm text-gray-900">
									{profile?.full_name || user?.email || 'N/A'}
								</p>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500">Email</label>
								<p className="mt-0.5 text-sm text-gray-900">
									{profile?.email || user?.email || 'N/A'}
								</p>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500">Phone</label>
								<p className="mt-0.5 text-sm text-gray-900">{profile?.phone || 'N/A'}</p>
							</div>
							<div>
								<label className="block text-xs font-medium text-gray-500">Role</label>
								<p className="mt-0.5 text-sm text-gray-900 capitalize">
									{profile?.role?.replace('_', ' ') || 'N/A'}
								</p>
							</div>
						</div>
					</div>

					{/* Account Actions */}
					<div className="p-3">
						<button
							onClick={handleLogout}
							className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 active:bg-red-200"
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

