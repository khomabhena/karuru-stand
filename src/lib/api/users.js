import { supabase } from '../supabase.js'

/**
 * Fetch all user profiles
 */
export async function getUsers() {
	const { data, error } = await supabase
		.from('user_profiles')
		.select(`
			*,
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
 * Fetch a single user profile by ID
 */
export async function getUser(id) {
	const { data, error } = await supabase
		.from('user_profiles')
		.select(`
			*,
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
 * Update a user profile (role, agency_id, etc.)
 */
export async function updateUser(id, userData) {
	const { data, error } = await supabase
		.from('user_profiles')
		.update(userData)
		.eq('id', id)
		.select()
		.single()

	if (error) throw error
	return data
}

