import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './auth/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignIn } from './pages/auth/SignIn.jsx'
import { SignUp } from './pages/auth/SignUp.jsx'
import { ForgotPassword } from './pages/auth/ForgotPassword.jsx'
import StandsList from './pages/stands/List.jsx'
import NewStand from './pages/stands/New.jsx'
import PaymentsList from './pages/payments/List.jsx'
import NewPayment from './pages/payments/New.jsx'
import SalesList from './pages/sales/List.jsx'
import NewSale from './pages/sales/New.jsx'
import CustomersList from './pages/customers/List.jsx'
import AgenciesList from './pages/agencies/List.jsx'
import ReportsPage from './pages/reports/Index.jsx'

const router = createBrowserRouter([
	{ path: '/', element: <SignIn /> },
	{ path: '/app', element: <App /> },
	{ path: '/signin', element: <SignIn /> },
	{ path: '/signup', element: <SignUp /> },
	{ path: '/forgot-password', element: <ForgotPassword /> },
	{ path: '/stands', element: <StandsList /> },
	{ path: '/stands/new', element: <NewStand /> },
	{ path: '/payments', element: <PaymentsList /> },
	{ path: '/payments/new', element: <NewPayment /> },
	{ path: '/sales', element: <SalesList /> },
	{ path: '/sales/new', element: <NewSale /> },
	{ path: '/customers', element: <CustomersList /> },
	{ path: '/agencies', element: <AgenciesList /> },
	{ path: '/reports', element: <ReportsPage /> }
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>
)


