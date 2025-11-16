import React, { useState } from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { useNavigate } from 'react-router-dom'

export default function NewStand() {
	const navigate = useNavigate()
	const [code, setCode] = useState('')
	const [size, setSize] = useState('')
	const [price, setPrice] = useState('')
	const [status, setStatus] = useState('Available')
	const [agency, setAgency] = useState('Agency A')

	function onSubmit(e) {
		e.preventDefault()
		// dummy submit
		alert(`Stand created: ${code}`)
		navigate('/stands')
	}

	return (
		<PageShell title="Add Stand">
			<Card title="Stand details">
				<form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
					<Input label="Code" value={code} onChange={e => setCode(e.target.value)} placeholder="PLOT-123" />
					<Input label="Size (sqm)" value={size} onChange={e => setSize(e.target.value)} placeholder="300" type="number" />
					<Input label="Price ($)" value={price} onChange={e => setPrice(e.target.value)} placeholder="7500" type="number" />
					<Select
						label="Status"
						value={status}
						onChange={e => setStatus(e.target.value)}
						options={['Available', 'Reserved', 'Sold'].map(v => ({ value: v, label: v }))}
					/>
					<Select
						label="Agency"
						value={agency}
						onChange={e => setAgency(e.target.value)}
						options={['Agency A', 'Agency B', 'Agency C', 'Agency D'].map(v => ({ value: v, label: v }))}
					/>
					<div className="sm:col-span-2">
						<button type="submit" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600">
							Create Stand
						</button>
					</div>
				</form>
			</Card>
		</PageShell>
	)
}


