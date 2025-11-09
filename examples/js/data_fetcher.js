/**
 * NASA NEO (Near-Earth Object) Data Fetcher
 * Fetches asteroid data from NASA API and processes it for various visualizations
 */

// Global variable to store fetched data
let asteroidData = null;

/**
 * Fetch asteroid data from NASA NEO API
 * @returns {Promise<Object>} Processed asteroid data
 */
async function fetchAsteroidData() {
    try {
        // Use API key from config file
        const apiKey = (typeof CONFIG !== 'undefined' && CONFIG.NASA_API_KEY) ? CONFIG.NASA_API_KEY : 'DEMO_KEY';
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=2024-01-01&end_date=2024-01-08&api_key=${apiKey}`);
        const data = await response.json();
        
        // Process and flatten the data
        asteroidData = processNEOData(data);
        return asteroidData;
    } catch (error) {
        console.error('Error fetching asteroid data:', error);
        throw error;
    }
}

/**
 * Process raw NASA NEO data into a flat array of asteroids
 * @param {Object} rawData - Raw API response
 * @returns {Object} Processed data with asteroids array and metadata
 */
function processNEOData(rawData) {
    const asteroids = [];
    const dates = Object.keys(rawData.near_earth_objects).sort();
    
    // Flatten the nested date structure
    dates.forEach(date => {
        rawData.near_earth_objects[date].forEach(asteroid => {
            asteroids.push({
                id: asteroid.id,
                name: asteroid.name,
                date: date,
                diameter_min: asteroid.estimated_diameter.kilometers.estimated_diameter_min,
                diameter_max: asteroid.estimated_diameter.kilometers.estimated_diameter_max,
                diameter_avg: (asteroid.estimated_diameter.kilometers.estimated_diameter_min + 
                              asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2,
                is_hazardous: asteroid.is_potentially_hazardous_asteroid,
                velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour),
                miss_distance: parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers),
                absolute_magnitude: asteroid.absolute_magnitude_h
            });
        });
    });
    
    return {
        asteroids: asteroids,
        dates: dates,
        total_count: asteroids.length,
        hazardous_count: asteroids.filter(a => a.is_hazardous).length,
        non_hazardous_count: asteroids.filter(a => !a.is_hazardous).length
    };
}

/**
 * Get asteroids grouped by date
 * @returns {Object} Object with dates as keys and asteroid arrays as values
 */
function getAsteroidsByDate() {
    if (!asteroidData) return null;
    
    const grouped = {};
    asteroidData.asteroids.forEach(asteroid => {
        if (!grouped[asteroid.date]) {
            grouped[asteroid.date] = [];
        }
        grouped[asteroid.date].push(asteroid);
    });
    
    return grouped;
}

/**
 * Get asteroids categorized by size
 * @returns {Object} Object with size categories and their asteroids
 */
function getAsteroidsBySizeCategory() {
    if (!asteroidData) return null;
    
    const categories = {
        small: [],    // < 0.1 km
        medium: [],   // 0.1 - 0.5 km
        large: [],    // 0.5 - 1 km
        very_large: [] // > 1 km
    };
    
    asteroidData.asteroids.forEach(asteroid => {
        const size = asteroid.diameter_avg;
        if (size < 0.1) categories.small.push(asteroid);
        else if (size < 0.5) categories.medium.push(asteroid);
        else if (size < 1) categories.large.push(asteroid);
        else categories.very_large.push(asteroid);
    });
    
    return categories;
}

/**
 * Get top N asteroids by a specific metric
 * @param {string} metric - The metric to sort by (e.g., 'diameter_avg', 'velocity')
 * @param {number} n - Number of top asteroids to return
 * @returns {Array} Array of top N asteroids
 */
function getTopAsteroids(metric, n = 10) {
    if (!asteroidData) return null;
    
    return [...asteroidData.asteroids]
        .sort((a, b) => b[metric] - a[metric])
        .slice(0, n);
}

/**
 * Get statistics for a specific metric
 * @param {string} metric - The metric to analyze
 * @returns {Object} Statistics object with min, max, mean, median, etc.
 */
function getMetricStats(metric) {
    if (!asteroidData) return null;
    
    const values = asteroidData.asteroids.map(a => a[metric]).sort((a, b) => a - b);
    const n = values.length;
    
    return {
        min: values[0],
        max: values[n - 1],
        mean: values.reduce((sum, v) => sum + v, 0) / n,
        median: n % 2 === 0 ? (values[n/2 - 1] + values[n/2]) / 2 : values[Math.floor(n/2)],
        q1: values[Math.floor(n * 0.25)],
        q3: values[Math.floor(n * 0.75)]
    };
}

/**
 * Get daily counts of hazardous and non-hazardous asteroids
 * @returns {Array} Array of objects with date and counts
 */
function getDailyCounts() {
    if (!asteroidData) return null;
    
    const byDate = getAsteroidsByDate();
    return asteroidData.dates.map(date => ({
        date: date,
        hazardous: byDate[date].filter(a => a.is_hazardous).length,
        non_hazardous: byDate[date].filter(a => !a.is_hazardous).length,
        total: byDate[date].length
    }));
}

/**
 * Initialize data fetching and return a promise
 * Call this when the page loads
 */
async function initializeData() {
    try {
        await fetchAsteroidData();
        console.log('✅ Asteroid data loaded successfully!');
        console.log(`Total asteroids: ${asteroidData.total_count}`);
        console.log(`Hazardous: ${asteroidData.hazardous_count}, Non-hazardous: ${asteroidData.non_hazardous_count}`);
        return asteroidData;
    } catch (error) {
        console.error('❌ Failed to load asteroid data:', error);
        throw error;
    }
}
