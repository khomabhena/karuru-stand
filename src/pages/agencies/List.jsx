import React from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { agencies } from '../../data/agencies.js'

export default function AgenciesList() {
	return (
		<PageShell title="Agencies">
			<DataTable
				title="All Agencies"
				searchableKeys={['name', 'contact', 'email']}
				columns={[
					{ key: 'name', header: 'Name' },
					{ key: 'contact', header: 'Contact' },
					{ key: 'email', header: 'Email' },
					{ key: 'deals', header: 'Active Deals' },
					{ key: 'updated', header: 'Updated' }
				]}
				rows={agencies}
			/>
		</PageShell>
	)
}


