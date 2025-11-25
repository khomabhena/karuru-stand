import { supabase } from '../supabase.js'

/**
 * Fetch all sales with related data
 */
export async function getSales() {
	const { data, error } = await supabase
		.from('sales')
		.select(`
			*,
			stands (
				id,
				stand_number,
				location
			),
			customers (
				id,
				first_name,
				last_name
			),
			agencies (
				id,
				name
			)
		`)
		.order('created_at', { ascending: false })

	if (error) throw error
	return data
}

/**
 * Fetch a single sale by ID with related data
 */
export async function getSale(id) {
	const { data, error } = await supabase
		.from('sales')
		.select(`
			*,
			stands (
				id,
				stand_number,
				location,
				area_sqm,
				price
			),
			customers (
				id,
				first_name,
				last_name,
				phone,
				email
			),
			agencies (
				id,
				name
			)
		`)
		.eq('id', id)
		.single()

	if (error) throw error
	return data
}

/**
 * Create a new sale
 */
export async function createSale(saleData) {
	const { data, error } = await supabase
		.from('sales')
		.insert([saleData])
		.select()
		.single()

	if (error) throw error
	return data
}

/**
 * Update a sale
 */
export async function updateSale(id, saleData) {
	const { data, error } = await supabase
		.from('sales')
		.update(saleData)
		.eq('id', id)
		.select()
		.single()

	if (error) throw error
	return data
}

/**
 * Delete a sale
 */
export async function deleteSale(id) {
	const { error } = await supabase
		.from('sales')
		.delete()
		.eq('id', id)

	if (error) throw error
}

/**
 * Fetch sales for a specific customer
 */
export async function getSalesByCustomer(customerId) {
	const { data, error } = await supabase
		.from('sales')
		.select(`
			*,
			stands (
				id,
				stand_number,
				location
			),
			agencies (
				id,
				name
			)
		`)
		.eq('customer_id', customerId)
		.order('sale_date', { ascending: false })

	if (error) throw error
	return data
}

/**
 * Generate a unique contract number
 * Format: CTR-YYY-MMNNN-DDNN (e.g., CTR-025-01001-1501)
 * - YYY = Last 3 digits of year (e.g., 025 for 2025)
 * - MM = Month (2 digits, e.g., 01 for January)
 * - NNN = Sequential number within the month (3 digits, e.g., 001)
 * - DD = Day (2 digits, e.g., 15)
 * - NN = Sequential number within the day (2 digits, e.g., 01)
 */
export async function generateContractNumber() {
	const now = new Date()
	const year = now.getFullYear()
	const yearCode = String(year).slice(-3).padStart(3, '0')
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	
	const prefix = `CTR-${yearCode}-${month}`
	const dayPrefix = `${prefix}XXX-${day}`

	// Get all contracts for the current month
	const { data, error } = await supabase
		.from('sales')
		.select('contract_number, created_at')
		.like('contract_number', `${prefix}%`)
		.order('created_at', { ascending: false })

	if (error) throw error

	// Find the highest sequential number for the month
	let maxMonthSeq = 0
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	
	if (data && data.length > 0) {
		data.forEach(sale => {
			if (sale.contract_number && sale.contract_number.startsWith(prefix)) {
				// Extract month sequence: MMNNN format
				const parts = sale.contract_number.split('-')
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

	// Get contracts for today to find day sequence
	let maxDaySeq = 0
	if (data && data.length > 0) {
		data.forEach(sale => {
			const saleDate = new Date(sale.created_at)
			saleDate.setHours(0, 0, 0, 0)
			
			// Check if it's from today and matches the format
			if (saleDate.getTime() === today.getTime() && sale.contract_number && sale.contract_number.startsWith(prefix)) {
				const parts = sale.contract_number.split('-')
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
	
	return `CTR-${yearCode}-${month}${monthSeq}-${day}${daySeq}`
}

