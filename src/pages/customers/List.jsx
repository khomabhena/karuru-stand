import React from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { customers } from '../../data/customers.js'

export default function CustomersList() {
	return (
		<PageShell title="Customers">
			<DataTable
				title="All Customers"
				searchableKeys={['name', 'email', 'phone']}
				columns={[
					{ key: 'name', header: 'Name' },
					{ key: 'email', header: 'Email' },
					{ key: 'phone', header: 'Phone' },
					{ key: 'contracts', header: 'Contracts' },
					{ key: 'updated', header: 'Updated' }
				]}
				rows={customers}
			/>
		</PageShell>
	)
}


