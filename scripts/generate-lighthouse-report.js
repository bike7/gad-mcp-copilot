const fs = require('fs');
const path = require('path');

const reportsDir = './lighthouse-reports';
const pages = ['home-page', 'login-page', 'register-page'];

const consolidatedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lighthouse Reports - All Pages</title>
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
        }
        .scores {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .score-card {
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            background: #f8f9fa;
        }
        .score-value {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
        }
        .score-label {
            font-size: 14px;
            color: #5f6368;
            text-transform: capitalize;
        }
        .score-good { color: #0cce6b; }
        .score-average { color: #ffa400; }
        .score-poor { color: #ff4e42; }
        .view-link {
            display: inline-block;
            padding: 10px 20px;
            background: #1a73e8;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 10px;
        }
        .view-link:hover {
            background: #1557b0;
        }
        .timestamp {
            text-align: center;
            color: #5f6368;
            margin-top: 20px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="reports-container">
        <h1>Lighthouse Performance Reports</h1>
        ${pages.map(pageName => {
            try {
                const jsonPath = path.join(reportsDir, `lighthouse-report-${pageName}.json`);
                const reportData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                const categories = reportData.categories;
                
                const getScoreClass = (score) => {
                    if (score >= 0.9) return 'score-good';
                    if (score >= 0.5) return 'score-average';
                    return 'score-poor';
                };
                
                return `
                    <div class="report-summary">
                        <h2>${pageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
                        <div class="scores">
                            ${Object.entries(categories).map(([key, data]) => `
                                <div class="score-card">
                                    <div class="score-label">${data.title}</div>
                                    <div class="score-value ${getScoreClass(data.score)}">
                                        ${Math.round(data.score * 100)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <a href="lighthouse-report-${pageName}.html" class="view-link" target="_blank">
                            View Detailed Report
                        </a>
                    </div>
                `;
            } catch (error) {
                return `<div class="report-summary"><h2>${pageName}</h2><p>Report not found</p></div>`;
            }
        }).join('')}
        <div class="timestamp">
            Generated: ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(reportsDir, 'consolidated-report.html'), consolidatedHtml);
console.log('Consolidated report generated: lighthouse-reports/consolidated-report.html');
