/**
 * Chart Registry - Defines all available visualizations
 * This allows the dashboard to be dynamically generated
 */

const CHART_REGISTRY = [
    {
        id: 'visualization-1',
        config: 'VISUALIZATION_1_CONFIG',
        render: 'renderVisualization1',
        section: 'practice'
    },
    {
        id: 'visualization-2',
        config: 'VISUALIZATION_2_CONFIG',
        render: 'renderVisualization2',
        section: 'practice'
    },
    {
        id: 'visualization-3',
        config: 'VISUALIZATION_3_CONFIG',
        render: 'renderVisualization3',
        section: 'practice'
    },
    {
        id: 'visualization-4',
        config: 'VISUALIZATION_4_CONFIG',
        render: 'renderVisualization4',
        section: 'practice'
    },
    {
        id: 'visualization-5',
        config: 'VISUALIZATION_5_CONFIG',
        render: 'renderVisualization5',
        section: 'practice'
    }
];

const SECTION_INFO = {
    practice: {
        title: '🎨 Practice Visualizations',
        icon: '🎨'
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
