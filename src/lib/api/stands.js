import { supabase } from '../supabase.js'

/**
 * Fetch all stands
 */
export async function getStands() {
	const { data, error } = await supabase
		.from('stands')
		.select('*')
		.order('created_at', { ascending: false })

	if (error) throw error
	return data
}

/**
 * Fetch a single stand by ID
 */
export async function getStand(id) {
	const { data, error } = await supabase
		.from('stands')
		.select('*')
		.eq('id', id)
		.single()

	if (error) throw error
	return data
}

/**
 * Create a new stand
 */
export async function createStand(standData) {
	const { data, error } = await supabase
		.from('stands')
		.insert([standData])
		.select()
		.single()

	if (error) throw error
	return data
}

/**
 * Update a stand
 */
export async function updateStand(id, standData) {
	const { data, error } = await supabase
		.from('stands')
		.update(standData)
		.eq('id', id)
		.select()
		.single()

	if (error) throw error
	return data
}

/**
 * Delete a stand
 */
export async function deleteStand(id) {
	const { error } = await supabase
		.from('stands')
		.delete()
		.eq('id', id)

	if (error) throw error
}

