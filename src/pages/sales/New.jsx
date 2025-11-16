import React, { useState } from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { useNavigate } from 'react-router-dom'

export default function NewSale() {
	const navigate = useNavigate()
	const [stand, setStand] = useState('PLOT-045')
	const [customer, setCustomer] = useState('T. Ndlovu')
	const [agency, setAgency] = useState('Agency A')
	const [price, setPrice] = useState('')
	const [deposit, setDeposit] = useState('')
	const [terms, setTerms] = useState('12')
	const [interest, setInterest] = useState('10')
	const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10))

	function onSubmit(e) {
		e.preventDefault()
		alert(`Sale created for ${stand}`)
		navigate('/sales')
	}

	return (
		<PageShell title="New Sale">
			<Card title="Sale details">
				<form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
					<Select label="Stand" value={stand} onChange={e => setStand(e.target.value)} options={['PLOT-045', 'PLOT-072', 'PLOT-019'].map(v => ({ value: v, label: v }))} />
					<Select label="Customer" value={customer} onChange={e => setCustomer(e.target.value)} options={['T. Ndlovu', 'J. Dube', 'S. Moyo'].map(v => ({ value: v, label: v }))} />
					<Select label="Agency" value={agency} onChange={e => setAgency(e.target.value)} options={['Agency A', 'Agency B', 'Agency C'].map(v => ({ value: v, label: v }))} />
					<Input label="Sale price ($)" value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="12000" />
					<Input label="Deposit ($)" value={deposit} onChange={e => setDeposit(e.target.value)} type="number" placeholder="1500" />
					<Input label="Terms (months)" value={terms} onChange={e => setTerms(e.target.value)} type="number" />
					<Input label="Interest (%)" value={interest} onChange={e => setInterest(e.target.value)} type="number" />
					<Input label="Start date" value={startDate} onChange={e => setStartDate(e.target.value)} type="date" />
					<div className="sm:col-span-2">
						<button type="submit" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600">Create Sale</button>
					</div>
				</form>
			</Card>
		</PageShell>
	)
}


