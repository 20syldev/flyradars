const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function fetchQuery<T>(endpoint: string): Promise<T[]> {
	const response = await fetch(`${API_URL}${endpoint}`);
	if (!response.ok) {
		throw new Error(`HTTP error: ${response.status}`);
	}
	return response.json();
}
