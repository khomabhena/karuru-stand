import { supabase } from '../supabase.js'

/**
 * Fetch all customers
 */
export async function getCustomers() {
	const { data, error } = await supabase
		.from('customers')
		.select('*')
		.order('created_at', { ascending: false })

	if (error) throw error
	return data
}

/**
 * Fetch a single customer by ID
 */
export async function getCustomer(id) {
	const { data, error } = await supabase
		.from('customers')
		.select('*')
		.eq('id', id)
		.single()

	if (error) throw error
	return data
}

/**
 * Create a new customer
 */
export async function createCustomer(customerData) {
	const { data, error } = await supabase
		.from('customers')
		.insert([customerData])
		.select()
		.single()

	if (error) throw error
	return data
}

/**
 * Update a customer
 */
export async function updateCustomer(id, customerData) {
	const { data, error } = await supabase
		.from('customers')
		.update(customerData)
		.eq('id', id)
		.select()
		.single()

	if (error) throw error
	return data
}

/**
 * Delete a customer
 */
export async function deleteCustomer(id) {
	const { error } = await supabase
		.from('customers')
		.delete()
		.eq('id', id)

	if (error) throw error
}

/**
 * Check if a customer with the given ID number already exists
 * @param {string} idNumber - The ID number to check
 * @param {string} excludeId - Optional customer ID to exclude from check (for updates)
 * @returns {Promise<Object|null>} - The existing customer if found, null otherwise
 */
export async function checkDuplicateIdNumber(idNumber, excludeId = null) {
	if (!idNumber || idNumber.trim() === '') {
		return null
	}

	let query = supabase
		.from('customers')
		.select('id, first_name, last_name, id_number')
		.eq('id_number', idNumber.trim())
		.limit(1)

	if (excludeId) {
		query = query.neq('id', excludeId)
	}

	const { data, error } = await query

	if (error) throw error
	return data && data.length > 0 ? data[0] : null
}

