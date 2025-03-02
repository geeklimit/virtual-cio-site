document.addEventListener('DOMContentLoaded', function() {
    const industryBenchmarks = {
        'technology': {
            sla: { value: 2, unit: 'hrs', source: 'HDI 2023 Report' },
            cost: { value: 8500, unit: '$', source: 'Gartner IT Spending Survey 2024' },
            procurement: { value: 5, unit: 'days', source: 'CAPS Research' }
        },
        'healthcare': {
            sla: { value: 4, unit: 'hrs', source: 'HDI Healthcare Benchmark 2023' },
            cost: { value: 7200, unit: '$', source: 'HIMSS Analytics' },
            procurement: { value: 12, unit: 'days', source: 'Healthcare Supply Chain Association' }
        },
        'finance': {
            sla: { value: 1.5, unit: 'hrs', source: 'Financial Services IT Benchmark Study' },
            cost: { value: 12500, unit: '$', source: 'Deloitte Banking Tech Trends' },
            procurement: { value: 7, unit: 'days', source: 'CAPS Research' }
        },
        'manufacturing': {
            sla: { value: 6, unit: 'hrs', source: 'Manufacturing IT Support Standards' },
            cost: { value: 5800, unit: '$', source: 'Industry Week IT Survey' },
            procurement: { value: 14, unit: 'days', source: 'Supply Chain Council' }
        },
        'retail': {
            sla: { value: 4, unit: 'hrs', source: 'Retail IT Support Benchmark' },
            cost: { value: 4200, unit: '$', source: 'NRF Technology Survey' },
            procurement: { value: 9, unit: 'days', source: 'Retail Supply Chain Association' }
        },
        'other': {
            sla: { value: 4, unit: 'hrs', source: 'HDI Global Benchmark' },
            cost: { value: 6500, unit: '$', source: 'Gartner Average' },
            procurement: { value: 10, unit: 'days', source: 'Cross-Industry Average' }
        }
    };

    const additionalMetrics = {
        'projects_on_time': { value: 68, unit: '%', source: 'PMI Pulse of the Profession' },
        'security_incidents': { value: 3.5, unit: 'per year', source: 'Ponemon Institute' },
        'uptime': { value: 99.9, unit: '%', source: 'Uptime Institute' },
        'user_satisfaction': { value: 4.2, unit: '/5', source: 'IT Customer Satisfaction Benchmark' },
        'avg_ticket_resolution': { value: 8.2, unit: 'hrs', source: 'ServiceDesk Institute' }
    };

    const industrySelect = document.getElementById('industry-select');
    if (industrySelect) {
        for (const industry in industryBenchmarks) {
            const option = document.createElement('option');
            option.value = industry;
            option.textContent = industry.charAt(0).toUpperCase() + industry.slice(1);
            industrySelect.appendChild(option);
        }
    }

    const additionalMetricsContainer = document.getElementById('additional-metrics-container');
    if (additionalMetricsContainer) {
        for (const metric in additionalMetrics) {
            const checkbox = document.createElement('div');
            checkbox.className = 'form-check';
            checkbox.innerHTML = `
                <input class="form-check-input additional-metric-checkbox" type="checkbox" id="${metric}" value="${metric}">
                <label class="form-check-label" for="${metric}">
                    ${formatMetricName(metric)}
                </label>
            `;
            additionalMetricsContainer.appendChild(checkbox);
        }
    }

    const metricsForm = document.getElementById('metrics-form');
    if (metricsForm) {
        metricsForm.addEventListener('submit', (e) => { 
            e.preventDefault();

            const industry = document.getElementById('industry-select').value || 'other';
            const benchmarks = industryBenchmarks[industry];
            
            const sla = parseFloat(document.querySelector("[name='sla']").value) || 0;
            const cost = parseFloat(document.querySelector("[name='cost']").value) || 0;
            const procurement = parseFloat(document.querySelector("[name='procurement']").value) || 0;
            
            const selectedAdditionalMetrics = {};
            document.querySelectorAll('.additional-metric-checkbox:checked').forEach(checkbox => {
                const metricKey = checkbox.value;
                const metricValue = parseFloat(document.querySelector(`[name='${metricKey}']`)?.value) || 0;
                selectedAdditionalMetrics[metricKey] = metricValue;
            });

            generateComparisonChart(
                { sla, cost, procurement, ...selectedAdditionalMetrics },
                benchmarks,
                selectedAdditionalMetrics
            );

            const resultsSection = document.getElementById('results');
            resultsSection.classList.remove('d-none');
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    document.querySelectorAll('.additional-metric-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const metricKey = this.value;
            const inputContainer = document.getElementById('additional-metrics-inputs');
            
            if (this.checked) {
                const inputDiv = document.createElement('div');
                inputDiv.className = 'mb-3 additional-metric-input';
                inputDiv.id = `input-${metricKey}`;
                inputDiv.innerHTML = `
                    <label class="form-label">${formatMetricName(metricKey)}:</label>
                    <div class="input-group">
                        <input type="number" class="form-control" name="${metricKey}">
                        <span class="input-group-text">${additionalMetrics[metricKey].unit}</span>
                    </div>
                `;
                inputContainer.appendChild(inputDiv);
            } else {
                const inputToRemove = document.getElementById(`input-${metricKey}`);
                if (inputToRemove) {
                    inputToRemove.remove();
                }
            }
        });
    });

    function generateComparisonChart(userMetrics, benchmarks, additionalSelectedMetrics) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        
        const header = document.createElement('h3');
        header.className = 'mb-4';
        header.textContent = 'Your IT Performance Comparison';
        resultsDiv.appendChild(header);
        
        const coreMetricsDiv = document.createElement('div');
        coreMetricsDiv.className = 'row row-cols-1 row-cols-md-3 g-4 mb-4';
        
        function createMetricCard(metricKey, userValue, benchmark, isLowerBetter = true) {
            const card = document.createElement('div');
            card.className = 'col';
            
            const performanceDiff = isLowerBetter 
                ? (benchmark.value - userValue) 
                : (userValue - benchmark.value);
            
            const isBetter = (isLowerBetter && performanceDiff > 0) || (!isLowerBetter && performanceDiff > 0);
            
            let performanceClass, performanceIcon, performanceText;
            
            if (isBetter || performanceDiff === 0) {
                performanceClass = 'text-success';
                performanceIcon = '<i class="bi bi-check-circle-fill"></i>';
                performanceText = 'Meets or exceeds average';
            } else {
                performanceClass = 'text-danger';
                performanceIcon = '<i class="bi bi-exclamation-triangle-fill"></i>';
                performanceText = 'Needs improvement';
            }
            
            const percentDiff = Math.min(Math.abs(performanceDiff / benchmark.value * 100), 100);
            const progressBarClass = (isBetter || performanceDiff === 0) ? 'bg-success' : 'bg-danger';
            
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${formatMetricName(metricKey)}</h5>
                        <p class="card-text">Your value: <strong>${userValue} ${benchmark.unit}</strong></p>
                        <p class="card-text">Industry average: <strong>${benchmark.value} ${benchmark.unit}</strong></p>
                        <div class="progress mb-3">
                            <div class="${progressBarClass} progress-bar" role="progressbar" 
                                style="width: ${percentDiff}%" 
                                aria-valuenow="${percentDiff}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p class="card-text ${performanceClass}">${performanceIcon} ${performanceText}</p>
                        <p class="card-text"><small class="text-muted">Source: ${benchmark.source}</small></p>
                    </div>
                </div>
            `;
            
            return card;
        }
        
        const coreMetrics = [];
        coreMetrics.push({ key: 'sla', card: createMetricCard('sla', userMetrics.sla, benchmarks.sla, true) });
        coreMetrics.push({ key: 'cost', card: createMetricCard('cost', userMetrics.cost, benchmarks.cost, true) });
        coreMetrics.push({ key: 'procurement', card: createMetricCard('procurement', userMetrics.procurement, benchmarks.procurement, true) });
        
        coreMetrics.forEach(metric => coreMetricsDiv.appendChild(metric.card));
        resultsDiv.appendChild(coreMetricsDiv);
        
        const additionalMetricsResults = [];
        if (Object.keys(additionalSelectedMetrics).length > 0) {
            const additionalHeader = document.createElement('h4');
            additionalHeader.className = 'mt-4 mb-3';
            additionalHeader.textContent = 'Additional Metrics';
            resultsDiv.appendChild(additionalHeader);
            
            const additionalMetricsDiv = document.createElement('div');
            additionalMetricsDiv.className = 'row row-cols-1 row-cols-md-2 g-4';
            
            additionalMetricsResults.push({ key: 'projects_on_time', card: createMetricCard('projects_on_time', userMetrics.projects_on_time, additionalMetrics.projects_on_time, false) });
            additionalMetricsResults.push({ key: 'security_incidents', card: createMetricCard('security_incidents', userMetrics.security_incidents, additionalMetrics.security_incidents, true) });
            additionalMetricsResults.push({ key: 'uptime', card: createMetricCard('uptime', userMetrics.uptime, additionalMetrics.uptime, false) });
            additionalMetricsResults.push({ key: 'user_satisfaction', card: createMetricCard('user_satisfaction', userMetrics.user_satisfaction, additionalMetrics.user_satisfaction, false) });
            additionalMetricsResults.push({ key: 'avg_ticket_resolution', card: createMetricCard('avg_ticket_resolution', userMetrics.avg_ticket_resolution, additionalMetrics.avg_ticket_resolution, true) });
            
            additionalMetricsResults.forEach(metric => {
                if (userMetrics[metric.key] !== undefined) {
                    additionalMetricsDiv.appendChild(metric.card);
                }
            });
            
            resultsDiv.appendChild(additionalMetricsDiv);
        }
        
        // Dynamic recommendation based on results
        const allMetrics = [...coreMetrics, ...additionalMetricsResults.filter(m => userMetrics[m.key] !== undefined)];
        const needsImprovementCount = allMetrics.filter(metric => {
            const isLowerBetter = (metric.key === 'sla' || metric.key === 'cost' || metric.key === 'procurement' || metric.key === 'security_incidents' || metric.key === 'avg_ticket_resolution');
            const performanceDiff = isLowerBetter 
                ? (metric.card.querySelector('.card-body p:nth-child(3) strong').textContent.split(' ')[0] - userMetrics[metric.key]) 
                : (userMetrics[metric.key] - metric.card.querySelector('.card-body p:nth-child(3) strong').textContent.split(' ')[0]);
            return !((isLowerBetter && performanceDiff > 0) || (!isLowerBetter && performanceDiff > 0) || performanceDiff === 0);
        }).length;

        const totalAvailableMetrics = 8; // 3 core + 5 additional
        const usedMetricsCount = allMetrics.length;
        const allGood = needsImprovementCount === 0;

        const recommendationDiv = document.createElement('div');
        recommendationDiv.className = 'alert alert-primary mt-4';
        
        if (allGood) {
            recommendationDiv.innerHTML = `
                <h4>Great Work!</h4>
                <p>Your entered IT metrics meet or exceed industry averages—well done! Even top performers can unlock new potential with expert guidance. ${
                    usedMetricsCount < totalAvailableMetrics 
                    ? 'For a complete picture, consider assessing all available metrics below.' 
                    : ''
                }</p>
                <a href="/services.html" class="btn btn-primary">Explore Consulting Services</a>
            `;
        } else {
            recommendationDiv.innerHTML = `
                <h4>What's Next?</h4>
                <p>Based on your metrics, there are opportunities to optimize your IT operations and strategy. ${
                    usedMetricsCount < totalAvailableMetrics 
                    ? 'Complete the full assessment for a comprehensive view of your IT performance.' 
                    : ''
                }</p>
                <a href="/services.html" class="btn btn-primary">See Available Services</a>
            `;
        }
        
        resultsDiv.appendChild(recommendationDiv);
    }

    function formatMetricName(metricKey) {
        return metricKey.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
});