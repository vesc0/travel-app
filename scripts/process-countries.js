const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download file
function downloadFile(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(data);
            });
        }).on('error', reject);
    });
}

async function processCountries() {
    try {
        console.log('Fetching TopoJSON data...');

        // Fetch the TopoJSON data from a reliable source
        const topoData = await downloadFile('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');

        // Save the raw TopoJSON
        fs.writeFileSync(
            path.join(__dirname, '../assets/world-50m.json'),
            topoData
        );

        // Parse the data to extract country information
        const worldData = JSON.parse(topoData);
        const countries = worldData.objects.countries.geometries.map(g => g.properties.name);

        console.log(`Found ${countries.length} countries`);

        // Save the list of countries for reference
        fs.writeFileSync(
            path.join(__dirname, '../temp/countries-list.json'),
            JSON.stringify(countries.sort(), null, 2)
        );

        console.log('Processing complete! New map data has been saved.');
        console.log('Please review the generated files:');
        console.log('1. /assets/world-50m.json - Updated map data');
        console.log('2. /temp/countries-list.json - List of all countries');

    } catch (error) {
        console.error('Error processing countries:', error);
    }
}

processCountries();