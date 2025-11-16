import React, { useState } from 'react'
import { PageShell } from '../simple/PageShell.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Input } from '../../components/ui/Input.jsx'
import { Select } from '../../components/ui/Select.jsx'
import { useNavigate } from 'react-router-dom'

export default function NewPayment() {
	const navigate = useNavigate()
	const [contract, setContract] = useState('KAR-2025-0112')
	const [amount, setAmount] = useState('')
	const [method, setMethod] = useState('Cash')
	const [reference, setReference] = useState('')
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

	function onSubmit(e) {
		e.preventDefault()
		alert(`Payment recorded: $${amount}`)
		navigate('/payments')
	}

	return (
		<PageShell title="Record Payment">
			<Card title="Payment details">
				<form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
					<Select label="Contract" value={contract} onChange={e => setContract(e.target.value)} options={['KAR-2025-0112', 'KAR-2025-0107', 'KAR-2025-0095'].map(v => ({ value: v, label: v }))} />
					<Input label="Amount ($)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="800" />
					<Select label="Method" value={method} onChange={e => setMethod(e.target.value)} options={['Cash', 'Bank Transfer', 'Mobile Money'].map(v => ({ value: v, label: v }))} />
					<Input label="Reference" value={reference} onChange={e => setReference(e.target.value)} placeholder="TRX-123" />
					<Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
					<div className="sm:col-span-2">
						<button type="submit" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600">Record Payment</button>
					</div>
				</form>
			</Card>
		</PageShell>
	)
}


