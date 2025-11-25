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
 * Format: KAR-YYYY-NNNN (e.g., KAR-2025-0001)
 */
export async function generateContractNumber() {
	const year = new Date().getFullYear()
	const prefix = `KAR-${year}-`

	// Get the highest contract number for this year
	const { data, error } = await supabase
		.from('sales')
		.select('contract_number')
		.like('contract_number', `${prefix}%`)
		.order('contract_number', { ascending: false })
		.limit(1)

	if (error) throw error

	if (data && data.length > 0 && data[0].contract_number) {
		// Extract the number part and increment
		const lastNumber = parseInt(data[0].contract_number.split('-')[2]) || 0
		const nextNumber = String(lastNumber + 1).padStart(4, '0')
		return `${prefix}${nextNumber}`
	}

	// First contract of the year
	return `${prefix}0001`
}

