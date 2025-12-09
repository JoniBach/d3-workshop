/**
 * Visualization 1 - Asteroid Detection Timeline
 * Line chart showing the number of asteroids detected per day
 */

// Chart metadata
window.VISUALIZATION_1_CONFIG = {
    title: 'A complete working line chart',
    subtitle: 'Daily count of near-Earth objects detected',
    description: 'This line chart visualizes the number of asteroids detected each day, helping identify patterns in asteroid detection frequency.',
    category: 'practice'
};

/**
 * Render Visualization 1
 * @param {string} containerId - The ID of the container element
 * @param {Object} data - The asteroid data object
 */
function renderVisualization1(containerId, data) {
    // ============================================================================
    // STEP 1: SETUP - Prepare the container and set chart dimensions
    // ============================================================================
    // Select the container element by ID and clear any existing content
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    // Define margins and calculate inner dimensions
    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // ============================================================================
    // STEP 2: CREATE SVG CANVAS - Build the drawing area
    // ============================================================================
    // Create the main SVG element and add a group (g) element
    // The group is translated by margins to create space for axes
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // ============================================================================
    // STEP 3: PREPARE DATA - Get the data we need for the line chart
    // ============================================================================
    // Get daily asteroid counts from the data provider
    // Returns array of objects: {date, total, hazardous, non_hazardous}
    const chartData = getChartData(data).line;
    
    // ============================================================================
    // STEP 4: CREATE SCALES - Map data values to pixel positions
    // ============================================================================
    // X scale: Maps date strings to horizontal pixel positions
    const xScale = d3.scaleBand()
        .domain(chartData.map(d => d.date))  // All dates
        .range([0, width])                    // Pixel range
        .padding(0.1);                        // Space between bands
    
    // Y scale: Maps counts to vertical positions
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.total)])  // 0 to max count
        .nice()                                         // Round to nice numbers
        .range([height, 0]);                           // Bottom to top (inverted)
    
    // ============================================================================
    // STEP 5: DRAW AXES - Add X and Y axes to the chart
    // ============================================================================
    // X axis: Position at bottom with formatted dates (MM/DD)
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d.split('-').slice(1).join('/')))
    
    // Y axis on the left
    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(6));
    
    // ============================================================================
    // STEP 6: ADD LABELS - Label the axes so viewers know what they represent
    // ============================================================================
    // X axis label: Centered below the chart
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .text('Date');
    
    // Y axis label (rotated)
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -60)
        .attr('text-anchor', 'middle')
        .text('Number of Asteroids');
    
    // ============================================================================
    // STEP 7: DRAW THE LINE and DATA POINTS  - Create and render the main line path
    // ============================================================================
    // Create a line generator function that converts data to SVG path
    const line = d3.line()
        .x(d => xScale(d.date) + xScale.bandwidth() / 2)  // Center on band
        .y(d => yScale(d.total))                           // Height based on count
        .curve(d3.curveMonotoneX);                         // Smooth curve
    
    // Add the line path
    svg.append('path')
        .datum(chartData)           // Bind all data to single path
        .attr('fill', 'none')       // No fill, just stroke
        .attr('stroke', '#4CAF50')  // Green line
        .attr('stroke-width', 2.5)
        .attr('d', line);           // Generate path from data

    // Add circles to mark each data point on the line
    svg.selectAll('.dot')
        .data(chartData)            // Bind data
        .enter()                    // Create elements for new data
        .append('circle')
        .attr('cx', d => xScale(d.date) + xScale.bandwidth() / 2)  // X position
        .attr('cy', d => yScale(d.total))                           // Y position
        .attr('r', 4)               // Radius
        .attr('fill', '#4CAF50');   // Green fill

        
    console.log('📊 Visualization 1 rendered:', chartData.length, 'data points');
}
