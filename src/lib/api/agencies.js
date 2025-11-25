import { supabase } from '../supabase.js'

/**
 * Fetch all agencies
 */
export async function getAgencies() {
	const { data, error } = await supabase
		.from('agencies')
		.select('*')
		.order('created_at', { ascending: false })

	if (error) throw error
	return data
}

/**
 * Fetch a single agency by ID
 */
export async function getAgency(id) {
	const { data, error } = await supabase
		.from('agencies')
		.select('*')
		.eq('id', id)
		.single()

	if (error) throw error
	return data
}

/**
 * Create a new agency
 */
export async function createAgency(agencyData) {
	const { data, error } = await supabase
		.from('agencies')
		.insert([agencyData])
		.select()
		.single()

	if (error) throw error
	return data
}

/**
 * Update an agency
 */
export async function updateAgency(id, agencyData) {
	const { data, error } = await supabase
		.from('agencies')
		.update(agencyData)
		.eq('id', id)
		.select()
		.single()

	if (error) throw error
	return data
}

/**
 * Delete an agency
 */
export async function deleteAgency(id) {
	const { error } = await supabase
		.from('agencies')
		.delete()
		.eq('id', id)

	if (error) throw error
}

