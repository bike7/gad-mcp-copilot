const fs = require('fs');
const path = require('path');

const reportsDir = './accessibility-reports';
const pages = ['home-page', 'login-page', 'register-page'];

// Function to parse HTML and extract accessibility data
function parseAccessibilityReport(htmlContent) {
  // Extract URL - simplified
  const urlMatch = htmlContent.match(/Page URL:\s*<a[^>]*>([^<]+)<\/a>/);
  let url = urlMatch ? urlMatch[1] : 'N/A';
  url = url.replace(/&#x2F;/g, '/').replace(/&#x3A;/g, ':');

  // Extract total violations count
  const violationsMatch = htmlContent.match(
    /<h2>axe-core found <span class="badge badge-warning">(\d+)<\/span> violations<\/h2>/
  );
  const totalViolations = violationsMatch ? parseInt(violationsMatch[1]) : 0;

  const impactCounts = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };

  const violations = [];

  // Find the table section and extract rows more efficiently
  const tableStart = htmlContent.indexOf('<tbody>');
  const tableEnd = htmlContent.indexOf('</tbody>');

  if (tableStart !== -1 && tableEnd !== -1) {
    const tableBody = htmlContent.substring(tableStart, tableEnd);
    const rows = tableBody.split('<tr>').slice(1); // Skip first empty element

    rows.forEach((row) => {
      // Simple extraction of table cells
      const cells = row.match(/<td>([^<]*)<\/td>/g);
      if (cells && cells.length >= 5) {
        const description = cells[0].replace(/<\/?td>/g, '');
        const ruleId = cells[1].replace(/<\/?td>/g, '');
        const impact = cells[3].replace(/<\/?td>/g, '');
        const count = parseInt(cells[4].replace(/<\/?td>/g, ''));

        if (['critical', 'serious', 'moderate', 'minor'].includes(impact)) {
          impactCounts[impact] += count;
          violations.push({ description, ruleId, impact, count });
        }
      }
    });
  }

  return {
    url,
    totalViolations,
    impactCounts,
    violations,
  };
}

// Generate consolidated report
const consolidatedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Reports - All Pages</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }
        .reports-container {
            max-width: 1400px;
            margin: 0 auto;
        }
        .report-summary {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .report-summary h2 {
            margin-top: 0;
            color: #1a73e8;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }
        .page-url {
            font-size: 13px;
            color: #666;
            margin-bottom: 15px;
            word-break: break-all;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .metric-card {
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid;
        }
        .metric-total {
            background: #fff8e1;
            border-color: #ffa726;
        }
        .metric-critical {
            background: #ffebee;
            border-color: #ef5350;
        }
        .metric-serious {
            background: #fff3e0;
            border-color: #ff9800;
        }
        .metric-moderate {
            background: #fff9e6;
            border-color: #ffc107;
        }
        .metric-minor {
            background: #e8f5e9;
            border-color: #66bb6a;
        }
        .metric-value {
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
        }
        .metric-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .violations-list {
            margin-top: 20px;
        }
        .violations-header {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }
        .violation-item {
            background: #f9f9f9;
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 4px;
            border-left: 4px solid;
            font-size: 14px;
        }
        .violation-critical { border-left-color: #ef5350; }
        .violation-serious { border-left-color: #ff9800; }
        .violation-moderate { border-left-color: #ffc107; }
        .violation-minor { border-left-color: #66bb6a; }
        .violation-description {
            font-weight: 500;
            color: #333;
        }
        .violation-meta {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .impact-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            margin-right: 8px;
        }
        .badge-critical {
            background: #ef5350;
            color: white;
        }
        .badge-serious {
            background: #ff9800;
            color: white;
        }
        .badge-moderate {
            background: #ffc107;
            color: #333;
        }
        .badge-minor {
            background: #66bb6a;
            color: white;
        }
        .view-link {
            display: inline-block;
            padding: 10px 20px;
            background: #1a73e8;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
            font-size: 14px;
        }
        .view-link:hover {
            background: #1557b0;
        }
        .timestamp {
            text-align: center;
            color: #5f6368;
            margin-top: 30px;
            font-size: 14px;
        }
        .summary-section {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .summary-section h3 {
            margin: 0 0 10px 0;
            color: #1565c0;
        }
        .summary-stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }
        .summary-stat {
            font-size: 14px;
        }
        .summary-stat strong {
            font-size: 18px;
            display: block;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <div class="reports-container">
        <h1>Accessibility Audit Reports (Axe-Core)</h1>
        <p class="subtitle">Web Content Accessibility Guidelines (WCAG) Compliance Analysis</p>
        
        ${pages
          .map((pageName) => {
            try {
              const htmlPath = path.join(
                reportsDir,
                `accessibility-report-${pageName}.html`
              );
              const htmlContent = fs.readFileSync(htmlPath, 'utf8');
              const reportData = parseAccessibilityReport(htmlContent);

              const pageTitle = pageName
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase());

              return `
                <div class="report-summary">
                    <h2>${pageTitle}</h2>
                    <div class="page-url">URL: ${reportData.url}</div>
                    
                    <div class="metrics">
                        <div class="metric-card metric-total">
                            <div class="metric-label">Total Violations</div>
                            <div class="metric-value">${reportData.totalViolations}</div>
                        </div>
                        <div class="metric-card metric-critical">
                            <div class="metric-label">Critical</div>
                            <div class="metric-value">${reportData.impactCounts.critical}</div>
                        </div>
                        <div class="metric-card metric-serious">
                            <div class="metric-label">Serious</div>
                            <div class="metric-value">${reportData.impactCounts.serious}</div>
                        </div>
                        <div class="metric-card metric-moderate">
                            <div class="metric-label">Moderate</div>
                            <div class="metric-value">${reportData.impactCounts.moderate}</div>
                        </div>
                        <div class="metric-card metric-minor">
                            <div class="metric-label">Minor</div>
                            <div class="metric-value">${reportData.impactCounts.minor}</div>
                        </div>
                    </div>
                    
                    ${
                      reportData.violations.length > 0
                        ? `
                    <div class="violations-list">
                        <div class="violations-header">Top Violations:</div>
                        ${reportData.violations
                          .slice(0, 5)
                          .map(
                            (v) => `
                            <div class="violation-item violation-${v.impact}">
                                <div class="violation-description">${v.description}</div>
                                <div class="violation-meta">
                                    <span class="impact-badge badge-${v.impact}">${v.impact}</span>
                                    <span>Rule ID: ${v.ruleId}</span>
                                    <span>• Count: ${v.count}</span>
                                </div>
                            </div>
                        `
                          )
                          .join('')}
                        ${
                          reportData.violations.length > 5
                            ? `<p style="font-size: 13px; color: #666; margin-top: 10px;">And ${reportData.violations.length - 5} more violations...</p>`
                            : ''
                        }
                    </div>
                    `
                        : '<p style="color: #4caf50; font-weight: 500;">✓ No violations found!</p>'
                    }
                    
                    <a href="accessibility-report-${pageName}.html" class="view-link" target="_blank">
                        View Detailed Report →
                    </a>
                </div>
            `;
            } catch (error) {
              const pageTitle = pageName
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l) => l.toUpperCase());
              return `
                <div class="report-summary">
                    <h2>${pageTitle}</h2>
                    <p style="color: #d32f2f;">⚠️ Report not found. Please run accessibility tests first.</p>
                </div>
            `;
            }
          })
          .join('')}
        
        <div class="timestamp">
            Generated: ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
`;

// Write consolidated report
fs.writeFileSync(
  path.join(reportsDir, 'consolidated-report.html'),
  consolidatedHtml
);
console.log(
  'Consolidated accessibility report generated: accessibility-reports/consolidated-report.html'
);
