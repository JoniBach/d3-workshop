/**
 * Box Plot - Size Distribution with Quartiles
 * Demonstrates: Statistical visualization, quartiles, outliers
 */

// Chart metadata
window.BOX_PLOT_CONFIG = {
    title: 'Box Plot',
    subtitle: 'Asteroid size distribution with quartiles',
    description: 'Statistical visualization showing median, quartiles, and outliers. The box represents the interquartile range (IQR), whiskers show min/max, and dots are outliers.',
    category: 'distribution'
};

function renderBoxPlot(containerId, data) {
    const container = d3.select(`#${containerId}`);
    container.selectAll('*').remove();
    
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // Get asteroid data for box plot
    const chartDataset = chartData(data).boxPlot;
    const stats = getMetricStats('diameter_avg');
    const diameters = chartDataset.map(d => d.diameter_avg).sort((a, b) => a - b);
    
    // Calculate IQR and outliers
    const iqr = stats.q3 - stats.q1;
    const lowerFence = stats.q1 - 1.5 * iqr;
    const upperFence = stats.q3 + 1.5 * iqr;
    const outliers = diameters.filter(d => d < lowerFence || d > upperFence);
    
    const svg = container
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(diameters)])
        .nice()
        .range([height, 0]);
    
    const boxWidth = 100;
    const center = width / 2;
    
    // Y axis
    svg.append('g')
        .call(d3.axisLeft(y));
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 15)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Diameter (km)');
    
    // Vertical line (whiskers)
    svg.append('line')
        .attr('x1', center)
        .attr('x2', center)
        .attr('y1', y(stats.min))
        .attr('y2', y(stats.max))
        .attr('stroke', 'black')
        .attr('stroke-width', 1);
    
    // Box (IQR)
    svg.append('rect')
        .attr('x', center - boxWidth / 2)
        .attr('y', y(stats.q3))
        .attr('width', boxWidth)
        .attr('height', y(stats.q1) - y(stats.q3))
        .attr('fill', '#3498db')
        .attr('opacity', 0.6)
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
    
    // Median line
    svg.append('line')
        .attr('x1', center - boxWidth / 2)
        .attr('x2', center + boxWidth / 2)
        .attr('y1', y(stats.median))
        .attr('y2', y(stats.median))
        .attr('stroke', 'black')
        .attr('stroke-width', 3);
    
    // Min/Max whisker caps
    [stats.min, stats.max].forEach(val => {
        svg.append('line')
            .attr('x1', center - 20)
            .attr('x2', center + 20)
            .attr('y1', y(val))
            .attr('y2', y(val))
            .attr('stroke', 'black')
            .attr('stroke-width', 2);
    });
    
    // Outliers
    svg.selectAll('.outlier')
        .data(outliers)
        .enter()
        .append('circle')
        .attr('class', 'outlier')
        .attr('cx', center)
        .attr('cy', d => y(d))
        .attr('r', 3)
        .attr('fill', '#e74c3c')
        .attr('opacity', 0.6);
    
    // Labels
    const labels = [
        { text: `Max: ${stats.max.toFixed(3)}`, y: stats.max },
        { text: `Q3: ${stats.q3.toFixed(3)}`, y: stats.q3 },
        { text: `Median: ${stats.median.toFixed(3)}`, y: stats.median },
        { text: `Q1: ${stats.q1.toFixed(3)}`, y: stats.q1 },
        { text: `Min: ${stats.min.toFixed(3)}`, y: stats.min }
    ];
    
    labels.forEach(label => {
        svg.append('text')
            .attr('x', center + boxWidth / 2 + 10)
            .attr('y', y(label.y) + 4)
            .style('font-size', '10px')
            .text(label.text);
    });
}
