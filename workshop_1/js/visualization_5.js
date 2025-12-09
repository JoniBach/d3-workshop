/**
 * Visualization 5 - Practice Project
 * TODO: Add your visualization description here
 */

// Chart metadata
window.VISUALIZATION_5_CONFIG = {
    title: 'Visualization 5',
    subtitle: 'Add your subtitle here - describe what this chart shows',
    description: 'Add a description of your visualization and what insights it provides.',
    category: 'practice'
};

/**
 * Render Visualization 5
 * @param {string} containerId - The ID of the container element
 * @param {Object} data - The asteroid data object
 */
function renderVisualization5(containerId, data) {
    // Select the container and clear any existing content
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    // Set up margins and dimensions
    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Create SVG element
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // TODO: Add your D3.js visualization code here
    // Example: Create scales, axes, and visual elements

    // Heres the chart data to start you off
    const chartData = getChartData(data).line;

    
    // Placeholder text
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '24px')
        .style('fill', '#666')
        .text('Build your visualization here!');
    
    console.log('📊 Visualization 5 rendered');
}
