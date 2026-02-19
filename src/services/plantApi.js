// Service layer for searching the Perenual plant database.
// All requests go through our Vercel proxy — the API key never reaches the client.

const PROXY_BASE_URL = 'https://plant-tracker-api.vercel.app';

/**
 * Search for plant species by name.
 * @param {string} query - The plant name to search for.
 * @returns {Array} Normalized array of plant species results.
 */
export async function searchPlants(query) {
  if (!query || typeof query !== 'string') throw new Error('Query must be a non-empty string');
  const url = `${PROXY_BASE_URL}/api/plants/search?q=${encodeURIComponent(query.trim())}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data = await response.json();
  return normalizePlantResults(data.data || []);
}

/**
 * Normalize raw Perenual API species data into a clean, consistent shape.
 * Extracts all available care fields for local storage.
 */
function normalizePlantResults(rawResults) {
  return rawResults.map((species) => ({
    speciesId: species.id,
    commonName: species.common_name || null,
    scientificName: Array.isArray(species.scientific_name)
      ? species.scientific_name[0]
      : species.scientific_name || null,
    watering: species.watering || null,
    sunlight: Array.isArray(species.sunlight) ? species.sunlight : [],
    cycle: species.cycle || null,
    thumbnail: species.default_image?.small_url || null,
  }));
}
