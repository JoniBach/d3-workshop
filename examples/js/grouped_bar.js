/**
 * Grouped Bar Chart - Hazardous vs Non-Hazardous by Size Category
 * Demonstrates: Grouped bars, nested scales
 */

// Chart metadata
window.GROUPED_BAR_CONFIG = {
    title: 'Grouped Bar Chart',
    subtitle: 'Hazardous vs non-hazardous by size category',
    description: 'Compares multiple values within categories using nested scales. Each size category shows hazardous and non-hazardous counts side-by-side.',
    category: 'categorical'
};

function renderGroupedBar(containerId, data) {
    // ============================================================================
    // STEP 1: SETUP - Prepare the container and set chart dimensions
    // ============================================================================
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // ============================================================================
    // STEP 2: CREATE SVG CANVAS - Build the drawing area
    // ============================================================================
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // ============================================================================
    // STEP 3: PREPARE DATA - Group asteroids by size and hazard status
    // ============================================================================
    const chartData = getChartData(data).groupedBar;
    const categories = ['small', 'medium', 'large', 'very_large'];
    const categoryLabels = {
        small: 'Small (<0.1km)',
        medium: 'Medium (0.1-0.5km)',
        large: 'Large (0.5-1km)',
        very_large: 'Very Large (>1km)'
    };
    
    // Prepare grouped data
    const groupedData = categories.map(cat => ({
        category: categoryLabels[cat],
        hazardous: chartData[cat].filter(a => a.is_hazardous).length,
        safe: chartData[cat].filter(a => !a.is_hazardous).length
    }));
    
    // ============================================================================
    // STEP 4: CREATE SCALES - Map data values to pixel positions
    // ============================================================================
    // X0 scale: Maps size categories to horizontal positions
    const x0 = d3.scaleBand()
        .domain(groupedData.map(d => d.category))
        .range([0, width])
        .padding(0.2);
    
    // X1 scale: Maps hazard status within each category
    const x1 = d3.scaleBand()
        .domain(['hazardous', 'safe'])
        .range([0, x0.bandwidth()])
        .padding(0.05);
    
    // Y scale: Maps counts to vertical positions
    const y = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => Math.max(d.hazardous, d.safe))])
        .nice()
        .range([height, 0]);
    
    // Color scale: Maps hazard status to colors
    const color = d3.scaleOrdinal()
        .domain(['hazardous', 'safe'])
        .range(['#e74c3c', '#2ecc71']);
    
    // ============================================================================
    // STEP 5: DRAW AXES - Add X and Y axes to the chart
    // ============================================================================
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0));
    
    svg.append('g')
        .call(d3.axisLeft(y));
    
    // ============================================================================
    // STEP 6: ADD LABELS - Label the Y axis
    // ============================================================================
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Count');
    
    // ============================================================================
    // STEP 7: DRAW GROUPED BARS - Create side-by-side bars for each category
    // ============================================================================
    // Create groups for each category
    const groups = svg.selectAll('.group')
        .data(groupedData)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${x0(d.category)},0)`);
    
    // Hazardous bars
    groups.append('rect')
        .attr('x', x1('hazardous'))
        .attr('y', d => y(d.hazardous))
        .attr('width', x1.bandwidth())
        .attr('height', d => height - y(d.hazardous))
        .attr('fill', color('hazardous'))
        .attr('opacity', 0.8);
    
    // Safe bars
    groups.append('rect')
        .attr('x', x1('safe'))
        .attr('y', d => y(d.safe))
        .attr('width', x1.bandwidth())
        .attr('height', d => height - y(d.safe))
        .attr('fill', color('safe'))
        .attr('opacity', 0.8);
    
    // ============================================================================
    // STEP 8: ADD LEGEND - Show hazardous vs safe categories
    // ============================================================================
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 120}, 0)`);
    
    ['hazardous', 'safe'].forEach((key, i) => {
        const row = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        row.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', color(key))
            .attr('opacity', 0.8);
        
        row.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '12px')
            .text(key === 'hazardous' ? 'Hazardous' : 'Safe');
    });
}
