/**
 * Chart Registry - Defines all available visualizations
 * This allows the dashboard to be dynamically generated
 */

const CHART_REGISTRY = [
    // Categorical/Comparison Charts
    {
        id: 'bar-chart',
        config: 'BAR_CHART_CONFIG',
        render: 'renderBarChart',
        section: 'categorical'
    },
    {
        id: 'horizontal-bar',
        config: 'HORIZONTAL_BAR_CONFIG',
        render: 'renderHorizontalBar',
        section: 'categorical'
    },
    {
        id: 'grouped-bar',
        config: 'GROUPED_BAR_CONFIG',
        render: 'renderGroupedBar',
        section: 'categorical'
    },
    {
        id: 'stacked-bar',
        config: 'STACKED_BAR_CONFIG',
        render: 'renderStackedBar',
        section: 'categorical'
    },
    {
        id: 'pie-chart',
        config: 'PIE_CHART_CONFIG',
        render: 'renderPieChart',
        section: 'categorical'
    },
    {
        id: 'donut-chart',
        config: 'DONUT_CHART_CONFIG',
        render: 'renderDonutChart',
        section: 'categorical'
    },
    
    // Distribution Charts
    {
        id: 'histogram',
        config: 'HISTOGRAM_CONFIG',
        render: 'renderHistogram',
        section: 'distribution'
    },
    {
        id: 'box-plot',
        config: 'BOX_PLOT_CONFIG',
        render: 'renderBoxPlot',
        section: 'distribution'
    },
    {
        id: 'violin-plot',
        config: 'VIOLIN_PLOT_CONFIG',
        render: 'renderViolinPlot',
        section: 'distribution'
    },
    
    // Relationship Charts
    {
        id: 'scatter-plot',
        config: 'SCATTER_PLOT_CONFIG',
        render: 'renderScatterPlot',
        section: 'relationship'
    },
    {
        id: 'bubble-chart',
        config: 'BUBBLE_CHART_CONFIG',
        render: 'renderBubbleChart',
        section: 'relationship'
    },
    {
        id: 'heatmap',
        config: 'HEATMAP_CONFIG',
        render: 'renderHeatmap',
        section: 'relationship'
    },
    
    // Time-Based Charts
    {
        id: 'line-chart',
        config: 'LINE_CHART_CONFIG',
        render: 'renderLineChart',
        section: 'time'
    },
    {
        id: 'area-chart',
        config: 'AREA_CHART_CONFIG',
        render: 'renderAreaChart',
        section: 'time'
    },
    {
        id: 'stream-graph',
        config: 'STREAM_GRAPH_CONFIG',
        render: 'renderStreamGraph',
        section: 'time'
    },
    {
        id: 'timeline',
        config: 'TIMELINE_CONFIG',
        render: 'renderTimeline',
        section: 'time'
    },
    
    // Part-to-Whole Charts
    {
        id: 'treemap',
        config: 'TREEMAP_CONFIG',
        render: 'renderTreemap',
        section: 'hierarchy'
    },
    {
        id: 'sunburst',
        config: 'SUNBURST_CONFIG',
        render: 'renderSunburst',
        section: 'hierarchy'
    },
    
    // Network Charts
    {
        id: 'force-directed',
        config: 'FORCE_DIRECTED_CONFIG',
        render: 'renderForceDirected',
        section: 'network'
    },
    {
        id: 'sankey',
        config: 'SANKEY_CONFIG',
        render: 'renderSankey',
        section: 'network'
    }
];

const SECTION_INFO = {
    categorical: {
        title: '📊 Categorical & Comparison Charts',
        icon: '📊'
    },
    distribution: {
        title: '📈 Distribution Charts',
        icon: '📈'
    },
    relationship: {
        title: '🔗 Relationship & Correlation Charts',
        icon: '🔗'
    },
    time: {
        title: '⏰ Time-Based Charts',
        icon: '⏰'
    },
    hierarchy: {
        title: '🧩 Part-to-Whole Charts',
        icon: '🧩'
    },
    network: {
        title: '🕸️ Network & Flow Charts',
        icon: '🕸️'
    }
};

/**
 * Build the dashboard dynamically from chart registry
 */
function buildDashboard() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) {
        console.error('❌ Dashboard element not found!');
        return;
    }
    
    console.log('🔨 Building dashboard...');
    
    // Clear existing content
    dashboard.innerHTML = '';
    
    // Group charts by section
    const sections = {};
    CHART_REGISTRY.forEach(chart => {
        if (!sections[chart.section]) {
            sections[chart.section] = [];
        }
        sections[chart.section].push(chart);
    });
    
    console.log(`📊 Found ${Object.keys(sections).length} sections`);
    
    // Build each section
    Object.keys(sections).forEach(sectionKey => {
        const sectionInfo = SECTION_INFO[sectionKey];
        const charts = sections[sectionKey];
        
        // Create section
        const section = document.createElement('section');
        section.className = 'chart-section';
        
        // Section title
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = sectionInfo.title;
        section.appendChild(sectionTitle);
        
        // Add charts
        charts.forEach(chart => {
            const config = window[chart.config];
            if (!config) {
                console.warn(`⚠️ Config not found: ${chart.config}`);
                return; // Skip if config not loaded
            }
            
            // Create chart card
            const card = document.createElement('div');
            card.className = 'chart-card';
            
            // Chart title
            const title = document.createElement('h3');
            title.textContent = config.title;
            card.appendChild(title);
            
            // Chart subtitle
            const subtitle = document.createElement('p');
            subtitle.className = 'chart-subtitle';
            subtitle.textContent = config.subtitle;
            card.appendChild(subtitle);
            
            // Chart container
            const container = document.createElement('div');
            container.id = chart.id;
            container.className = 'chart-container';
            card.appendChild(container);
            
            // Chart description (below the chart)
            if (config.description) {
                const description = document.createElement('p');
                description.className = 'chart-description';
                description.textContent = config.description;
                card.appendChild(description);
            }
            
            section.appendChild(card);
        });
        
        dashboard.appendChild(section);
    });
    
    console.log('✅ Dashboard built successfully!');
}

/**
 * Render all charts from registry
 */
function renderAllCharts(data) {
    CHART_REGISTRY.forEach(chart => {
        const renderFunc = window[chart.render];
        if (typeof renderFunc === 'function') {
            try {
                renderFunc(chart.id, data);
            } catch (error) {
                console.error(`Error rendering ${chart.id}:`, error);
            }
        }
    });
}
