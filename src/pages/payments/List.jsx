import React from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { payments } from '../../data/payments.js'

export default function PaymentsList() {
	return (
		<PageShell title="Payments">
			<DataTable
				title="All Payments"
				searchableKeys={['contract', 'method', 'reference', 'recordedBy']}
				columns={[
					{ key: 'date', header: 'Date' },
					{ key: 'contract', header: 'Contract #' },
					{ key: 'amount', header: 'Amount', render: v => `$${v.toLocaleString()}` },
					{ key: 'method', header: 'Method' },
					{ key: 'reference', header: 'Reference' },
					{ key: 'recordedBy', header: 'Recorded By' }
				]}
				rows={payments}
			/>
		</PageShell>
	)
}


