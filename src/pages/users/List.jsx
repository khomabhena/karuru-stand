import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { useRole } from '../../hooks/useRole.js'
import { getUsers, updateUser } from '../../lib/api/users.js'
import { getAgencies } from '../../lib/api/agencies.js'
import { theme } from '../../theme/colors.teal.js'

export default function UsersList() {
	const navigate = useNavigate()
	const { isAdmin } = useRole()
	const [users, setUsers] = useState([])
	const [agencies, setAgencies] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [editingUser, setEditingUser] = useState(null)
	const [editForm, setEditForm] = useState({ role: '', agency_id: '' })

	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		try {
			setLoading(true)
			const [usersData, agenciesData] = await Promise.all([
				getUsers(),
				getAgencies()
			])
			setUsers(usersData)
			setAgencies(agenciesData)
			setError('')
		} catch (err) {
			console.error('Error loading data:', err)
			setError(err.message || 'Failed to load users')
		} finally {
			setLoading(false)
		}
	}

	const handleEdit = (user) => {
		setEditingUser(user.id)
		setEditForm({
			role: user.role || '',
			agency_id: user.agency_id || ''
		})
	}

	const handleSave = async (userId) => {
		try {
			// Convert empty string to null for agency_id (PostgreSQL UUID requires null, not empty string)
			const updateData = {
				role: editForm.role,
				agency_id: editForm.agency_id || null
			}
			await updateUser(userId, updateData)
			await loadData()
			setEditingUser(null)
			setEditForm({ role: '', agency_id: '' })
		} catch (err) {
			console.error('Error updating user:', err)
			alert('Failed to update user: ' + (err.message || 'Unknown error'))
		}
	}

	const handleCancel = () => {
		setEditingUser(null)
		setEditForm({ role: '', agency_id: '' })
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	const getRoleColor = (role) => {
		switch (role) {
			case 'admin': return 'error'
			case 'agency_manager': return 'info'
			case 'agency_staff': return 'success'
			default: return 'neutral'
		}
	}

	const columns = [
		{ key: 'full_name', header: 'Name' },
		{ key: 'email', header: 'Email' },
		{ key: 'role', header: 'Role' },
		{ key: 'agency', header: 'Agency' },
		{ key: 'created_at', header: 'Created' },
		{ key: 'actions', header: 'Actions' },
	]

	const rows = users.map((user) => ({
		...user,
		role: editingUser === user.id ? (
			<select
				value={editForm.role}
				onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
				className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm"
			>
				<option value="admin">Admin</option>
				<option value="agency_manager">Agency Manager</option>
				<option value="agency_staff">Agency Staff</option>
				<option value="viewer">Viewer</option>
			</select>
		) : (
			<Badge color={getRoleColor(user.role)}>
				{user.role?.replace('_', ' ') || 'N/A'}
			</Badge>
		),
		agency: editingUser === user.id ? (
			<select
				value={editForm.agency_id}
				onChange={(e) => setEditForm({ ...editForm, agency_id: e.target.value })}
				className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm"
			>
				<option value="">No Agency</option>
				{agencies.map(agency => (
					<option key={agency.id} value={agency.id}>
						{agency.name}
					</option>
				))}
			</select>
		) : (
			<span className="text-sm text-gray-700">
				{user.agencies?.name || 'No Agency'}
			</span>
		),
		created_at: formatDate(user.created_at),
		actions: (
			<div className="flex flex-wrap gap-2">
				{editingUser === user.id ? (
					<>
						<button
							onClick={() => handleSave(user.id)}
							className="rounded px-2 py-1 text-sm text-green-700 active:bg-green-50 sm:hover:underline"
						>
							Save
						</button>
						<button
							onClick={handleCancel}
							className="rounded px-2 py-1 text-sm text-gray-700 active:bg-gray-50 sm:hover:underline"
						>
							Cancel
						</button>
					</>
				) : (
					isAdmin && (
						<button
							onClick={() => handleEdit(user)}
							className="rounded px-2 py-1 text-sm text-blue-700 active:bg-blue-50 sm:hover:underline"
						>
							Edit
						</button>
					)
				)}
			</div>
		),
	}))

	if (!isAdmin) {
		return (
			<PageShell title="Users">
				<div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
					You don't have permission to view this page.
				</div>
			</PageShell>
		)
	}

	return (
		<PageShell title="Users">
			<div className="mb-4">
				<p className="text-sm text-gray-600">
					Manage user accounts, roles, and agency assignments
				</p>
			</div>

			{error && (
				<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
						<p className="text-gray-600">Loading users...</p>
					</div>
				</div>
			) : (
				<DataTable
					title=""
					searchableKeys={['full_name', 'email', 'role']}
					columns={columns}
					rows={rows}
				/>
			)}
		</PageShell>
	)
}

