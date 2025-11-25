import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './auth/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignIn } from './pages/auth/SignIn.jsx'
import { SignUp } from './pages/auth/SignUp.jsx'
import { ForgotPassword } from './pages/auth/ForgotPassword.jsx'
import { ConfirmEmail } from './pages/auth/ConfirmEmail.jsx'
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx'
import { RoleGuard } from './components/auth/RoleGuard.jsx'
import StandsList from './pages/stands/List.jsx'
import NewStand from './pages/stands/New.jsx'
import EditStand from './pages/stands/Edit.jsx'
import PaymentsList from './pages/payments/List.jsx'
import NewPayment from './pages/payments/New.jsx'
import EditPayment from './pages/payments/Edit.jsx'
import SalesList from './pages/sales/List.jsx'
import NewSale from './pages/sales/New.jsx'
import SaleView from './pages/sales/View.jsx'
import EditSale from './pages/sales/Edit.jsx'
import CustomersList from './pages/customers/List.jsx'
import CustomerForm from './pages/customers/Form.jsx'
import CustomerView from './pages/customers/View.jsx'
import AgenciesList from './pages/agencies/List.jsx'
import AgencyForm from './pages/agencies/Form.jsx'
import AgencyView from './pages/agencies/View.jsx'
import UsersList from './pages/users/List.jsx'
import ReportsPage from './pages/reports/Index.jsx'
import SalesReport from './pages/reports/SalesReport.jsx'
import PaymentReport from './pages/reports/PaymentReport.jsx'
import SettingsPage from './pages/settings/Index.jsx'

const router = createBrowserRouter([
	// Public routes
	{ path: '/', element: <SignIn /> },
	{ path: '/signin', element: <SignIn /> },
	{ path: '/signup', element: <SignUp /> },
	{ path: '/forgot-password', element: <ForgotPassword /> },
	{ path: '/auth/confirm', element: <ConfirmEmail /> },

	// Protected routes - require authentication
	{
		path: '/app',
		element: (
			<ProtectedRoute>
				<App />
			</ProtectedRoute>
		),
	},
	{
		path: '/stands',
		element: (
			<ProtectedRoute>
				<StandsList />
			</ProtectedRoute>
		),
	},
	{
		path: '/stands/new',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin']}>
					<NewStand />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/stands/:id/edit',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin']}>
					<EditStand />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/payments',
		element: (
			<ProtectedRoute>
				<PaymentsList />
			</ProtectedRoute>
		),
	},
	{
		path: '/payments/new',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin', 'agency_manager', 'agency_staff']}>
					<NewPayment />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/payments/:id/edit',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin']}>
					<EditPayment />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/sales',
		element: (
			<ProtectedRoute>
				<SalesList />
			</ProtectedRoute>
		),
	},
	{
		path: '/sales/new',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin', 'agency_manager', 'agency_staff']}>
					<NewSale />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/sales/:id/edit',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin']}>
					<EditSale />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/sales/:id',
		element: (
			<ProtectedRoute>
				<SaleView />
			</ProtectedRoute>
		),
	},
	{
		path: '/customers',
		element: (
			<ProtectedRoute>
				<CustomersList />
			</ProtectedRoute>
		),
	},
	{
		path: '/customers/new',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin', 'agency_manager', 'agency_staff']}>
					<CustomerForm />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/customers/:id/edit',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin', 'agency_manager', 'agency_staff']}>
					<CustomerForm />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/customers/:id',
		element: (
			<ProtectedRoute>
				<CustomerView />
			</ProtectedRoute>
		),
	},
	{
		path: '/agencies',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin', 'agency_manager', 'viewer']}>
					<AgenciesList />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/agencies/new',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin']}>
					<AgencyForm />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/agencies/:id',
		element: (
			<ProtectedRoute>
				<AgencyView />
			</ProtectedRoute>
		),
	},
	{
		path: '/agencies/:id/edit',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin']}>
					<AgencyForm />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/users',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin']}>
					<UsersList />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/reports',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin', 'agency_manager', 'viewer']}>
					<ReportsPage />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/reports/sales',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin', 'agency_manager', 'viewer']}>
					<SalesReport />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/reports/payments',
		element: (
			<ProtectedRoute>
				<RoleGuard allowedRoles={['admin', 'agency_manager', 'viewer']}>
					<PaymentReport />
				</RoleGuard>
			</ProtectedRoute>
		),
	},
	{
		path: '/settings',
		element: (
			<ProtectedRoute>
				<SettingsPage />
			</ProtectedRoute>
		),
	},
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>
)
