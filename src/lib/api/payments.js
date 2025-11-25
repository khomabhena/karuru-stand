import { supabase } from '../supabase.js'

/**
 * Fetch all payments with related sale data
 */
export async function getPayments() {
	const { data, error } = await supabase
		.from('payments')
		.select(`
			*,
			sales (
				id,
				contract_number,
				customers (
					first_name,
					last_name
				)
			)
		`)
		.order('payment_date', { ascending: false })

	if (error) throw error

	// Fetch user profiles separately for created_by
	if (data && data.length > 0) {
		const userIds = [...new Set(data.map(p => p.created_by).filter(Boolean))]
		if (userIds.length > 0) {
			const { data: profiles } = await supabase
				.from('user_profiles')
				.select('id, full_name')
				.in('id', userIds)

			// Map profiles to payments
			if (profiles) {
				const profileMap = new Map(profiles.map(p => [p.id, p.full_name]))
				data.forEach(payment => {
					payment.user_profiles = payment.created_by ? {
						full_name: profileMap.get(payment.created_by) || 'Unknown'
					} : null
				})
			}
		}
	}

	return data
}

/**
 * Fetch a single payment by ID
 */
export async function getPayment(id) {
	const { data, error } = await supabase
		.from('payments')
		.select(`
			*,
			sales (
				id,
				contract_number,
				total_price,
				balance_remaining,
				customers (
					first_name,
					last_name
				)
			)
		`)
		.eq('id', id)
		.single()

	if (error) throw error
	return data
}

/**
 * Fetch payments for a specific sale
 */
export async function getPaymentsBySale(saleId) {
	const { data, error } = await supabase
		.from('payments')
		.select('*')
		.eq('sale_id', saleId)
		.order('payment_date', { ascending: false })

	if (error) throw error

	// Fetch user profiles separately for created_by
	if (data && data.length > 0) {
		const userIds = [...new Set(data.map(p => p.created_by).filter(Boolean))]
		if (userIds.length > 0) {
			const { data: profiles } = await supabase
				.from('user_profiles')
				.select('id, full_name')
				.in('id', userIds)

			// Map profiles to payments
			if (profiles) {
				const profileMap = new Map(profiles.map(p => [p.id, p.full_name]))
				data.forEach(payment => {
					payment.user_profiles = payment.created_by ? {
						full_name: profileMap.get(payment.created_by) || 'Unknown'
					} : null
				})
			}
		}
	}

	return data
}

/**
 * Generate a unique transaction number
 * Format: TRX-YYY-MMNNN-DDNN (e.g., TRX-025-01001-1501)
 * - YYY = Last 3 digits of year (e.g., 025 for 2025)
 * - MM = Month (2 digits, e.g., 01 for January)
 * - NNN = Sequential number within the month (3 digits, e.g., 001)
 * - DD = Day (2 digits, e.g., 15)
 * - NN = Sequential number within the day (2 digits, e.g., 01)
 */
export async function generateTransactionNumber() {
	const now = new Date()
	const year = now.getFullYear()
	const yearCode = String(year).slice(-3).padStart(3, '0')
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	
	const prefix = `TRX-${yearCode}-${month}`

	// Get all payments for the current month
	const { data, error } = await supabase
		.from('payments')
		.select('reference_number, created_at')
		.like('reference_number', `${prefix}%`)
		.order('created_at', { ascending: false })

	if (error) throw error

	// Find the highest sequential number for the month
	let maxMonthSeq = 0
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	
	if (data && data.length > 0) {
		data.forEach(payment => {
			if (payment.reference_number && payment.reference_number.startsWith(prefix)) {
				// Extract month sequence: MMNNN format
				const parts = payment.reference_number.split('-')
				if (parts.length >= 3) {
					const monthSeqPart = parts[2] || ''
					if (monthSeqPart.length >= 5) {
						// Extract NNN part (last 3 digits)
						const monthSeq = parseInt(monthSeqPart.slice(2)) || 0
						if (monthSeq > maxMonthSeq) maxMonthSeq = monthSeq
					}
				}
			}
		})
	}

	// Get payments for today to find day sequence
	let maxDaySeq = 0
	if (data && data.length > 0) {
		data.forEach(payment => {
			const paymentDate = new Date(payment.created_at)
			paymentDate.setHours(0, 0, 0, 0)
			
			// Check if it's from today and matches the format
			if (paymentDate.getTime() === today.getTime() && payment.reference_number && payment.reference_number.startsWith(prefix)) {
				const parts = payment.reference_number.split('-')
				if (parts.length >= 4) {
					const daySeqPart = parts[3] || ''
					if (daySeqPart.length >= 4) {
						// Extract NN part (last 2 digits)
						const daySeq = parseInt(daySeqPart.slice(2)) || 0
						if (daySeq > maxDaySeq) maxDaySeq = daySeq
					}
				}
			}
		})
	}

	const nextMonthSeq = maxMonthSeq + 1
	const nextDaySeq = maxDaySeq + 1
	const monthSeq = String(nextMonthSeq).padStart(3, '0')
	const daySeq = String(nextDaySeq).padStart(2, '0')
	
	return `TRX-${yearCode}-${month}${monthSeq}-${day}${daySeq}`
}

/**
 * Create a new payment
 */
export async function createPayment(paymentData) {
	// Auto-generate transaction number if not provided
	if (!paymentData.reference_number) {
		paymentData.reference_number = await generateTransactionNumber()
	}

	const { data, error } = await supabase
		.from('payments')
		.insert([paymentData])
		.select()
		.single()

	if (error) throw error

	// Update the sale's balance_remaining
	// Get the sale first
	const { data: sale, error: saleError } = await supabase
		.from('sales')
		.select('total_price, balance_remaining')
		.eq('id', paymentData.sale_id)
		.single()

	if (saleError) {
		console.error('Error fetching sale for balance update:', saleError)
		// Don't throw - payment was created successfully
		return data
	}

	// Calculate new balance
	const newBalance = parseFloat(sale.balance_remaining || sale.total_price) - parseFloat(paymentData.amount)

	// Update sale balance
	await supabase
		.from('sales')
		.update({ balance_remaining: Math.max(0, newBalance) })
		.eq('id', paymentData.sale_id)

	// Update sale status if balance is 0
	if (newBalance <= 0) {
		await supabase
			.from('sales')
			.update({ status: 'completed' })
			.eq('id', paymentData.sale_id)
	}

	return data
}

/**
 * Update a payment
 */
export async function updatePayment(id, paymentData) {
	const { data, error } = await supabase
		.from('payments')
		.update(paymentData)
		.eq('id', id)
		.select()
		.single()

	if (error) throw error
	return data
}

/**
 * Delete a payment
 */
export async function deletePayment(id) {
	// Get payment to know which sale to update
	const { data: payment, error: fetchError } = await supabase
		.from('payments')
		.select('sale_id, amount')
		.eq('id', id)
		.single()

	if (fetchError) throw fetchError

	// Delete the payment
	const { error } = await supabase
		.from('payments')
		.delete()
		.eq('id', id)

	if (error) throw error

	// Recalculate sale balance
	const { data: sale, error: saleError } = await supabase
		.from('sales')
		.select('total_price, balance_remaining')
		.eq('id', payment.sale_id)
		.single()

	if (!saleError) {
		const newBalance = parseFloat(sale.balance_remaining || sale.total_price) + parseFloat(payment.amount)
		await supabase
			.from('sales')
			.update({ 
				balance_remaining: Math.min(sale.total_price, newBalance),
				status: newBalance >= sale.total_price ? 'completed' : 'in_progress'
			})
			.eq('id', payment.sale_id)
	}
}

/**
 * Fetch sales with outstanding balances (for payment form)
 */
export async function getSalesWithBalance() {
	const { data, error } = await supabase
		.from('sales')
		.select(`
			id,
			contract_number,
			balance_remaining,
			total_price,
			customers (
				first_name,
				last_name
			)
		`)
		.gt('balance_remaining', 0)
		.eq('status', 'in_progress')
		.order('created_at', { ascending: false })

	if (error) throw error
	return data
}

