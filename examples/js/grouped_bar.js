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
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Get data by size category
    const sizeCategories = chartData(data).groupedBar;
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
        hazardous: sizeCategories[cat].filter(a => a.is_hazardous).length,
        safe: sizeCategories[cat].filter(a => !a.is_hazardous).length
    }));
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const x0 = d3.scaleBand()
        .domain(groupedData.map(d => d.category))
        .range([0, width])
        .padding(0.2);
    
    const x1 = d3.scaleBand()
        .domain(['hazardous', 'safe'])
        .range([0, x0.bandwidth()])
        .padding(0.05);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => Math.max(d.hazardous, d.safe))])
        .nice()
        .range([height, 0]);
    
    const color = d3.scaleOrdinal()
        .domain(['hazardous', 'safe'])
        .range(['#e74c3c', '#2ecc71']);
    
    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0));
    
    svg.append('g')
        .call(d3.axisLeft(y));
    
    // Y axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Count');
    
    // Groups
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
    
    // Legend
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
