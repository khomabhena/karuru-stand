import React from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Badge } from '../../components/ui/Badge.jsx'
import { sales } from '../../data/sales.js'

export default function SalesList() {
	return (
		<PageShell title="Sales">
			<DataTable
				title="All Sales"
				searchableKeys={['contract', 'stand', 'customer', 'agency', 'status']}
				columns={[
					{ key: 'contract', header: 'Contract #' },
					{ key: 'stand', header: 'Stand' },
					{ key: 'customer', header: 'Customer' },
					{ key: 'agency', header: 'Agency' },
					{ key: 'status', header: 'Status', render: v => <Badge color={v === 'Active' ? 'info' : v === 'Pending' ? 'warning' : 'success'}>{v}</Badge> },
					{ key: 'balance', header: 'Balance', render: v => `$${v.toLocaleString()}` },
					{ key: 'updated', header: 'Updated' }
				]}
				rows={sales}
			/>
		</PageShell>
	)
}


