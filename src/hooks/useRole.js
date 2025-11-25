import { useAuth } from '../auth/AuthContext'

/**
 * Hook to check user roles and permissions
 * @returns {Object} Role checking functions
 */
export function useRole() {
	const { user, profile } = useAuth()

	const isAdmin = () => profile?.role === 'admin'
	const isAgencyManager = () => profile?.role === 'agency_manager'
	const isAgencyStaff = () => profile?.role === 'agency_staff'
	const isViewer = () => profile?.role === 'viewer'

	const hasRole = (role) => profile?.role === role
	const hasAnyRole = (roles) => roles.includes(profile?.role)

	const canManageAgencies = () => isAdmin()
	const canManageStands = () => isAdmin()
	const canManageUsers = () => isAdmin() || isAgencyManager()
	const canViewReports = () => isAdmin() || isAgencyManager() || isViewer()
	const canCreateSales = () => isAdmin() || isAgencyManager() || isAgencyStaff()
	const canEditSales = () => isAdmin() || isAgencyManager()

	return {
		isAdmin: isAdmin(),
		isAgencyManager: isAgencyManager(),
		isAgencyStaff: isAgencyStaff(),
		isViewer: isViewer(),
		hasRole,
		hasAnyRole,
		canManageAgencies,
		canManageStands,
		canManageUsers,
		canViewReports,
		canCreateSales,
		canEditSales,
		userRole: profile?.role,
		agencyId: profile?.agency_id
	}
}

