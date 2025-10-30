const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download file
async function downloadFile(url) {
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

const topojson = require('topojson-client');

// Function to extract coordinates from TopoJSON
function extractCoordinates(topology) {
    const coordinates = {};
    const geojson = topojson.feature(topology, topology.objects.countries);

    geojson.features.forEach(feature => {
        const name = feature.properties.name;
        if (feature.geometry.type === 'Polygon') {
            coordinates[name] = [feature.geometry.coordinates[0].map(coord => ({
                latitude: coord[1],
                longitude: coord[0]
            }))];
        } else if (feature.geometry.type === 'MultiPolygon') {
            coordinates[name] = feature.geometry.coordinates.map(poly =>
                poly[0].map(coord => ({
                    latitude: coord[1],
                    longitude: coord[0]
                }))
            );
        }
    });

    return coordinates;
}

async function updateMapData() {
    try {
        console.log('1. Fetching updated world map data...');

        // Fetch the TopoJSON data
        const topoData = await downloadFile('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
        const worldData = JSON.parse(topoData);

        // 1. Update the world map data
        console.log('Saving new world map data...');
        fs.writeFileSync(
            path.join(__dirname, '../assets/world-50m.json'),
            topoData
        );

        // 2. Extract and format country coordinates
        console.log('2. Generating country coordinates...');
        const coordinates = extractCoordinates(worldData);

        // Get list of all countries from the map data
        const availableCountries = Object.keys(coordinates).sort();

        // Update the continents to only include countries with coordinates
        Object.keys(continents).forEach(continentKey => {
            continents[continentKey].countries = continents[continentKey].countries
                .filter(country => availableCountries.includes(country));
        });

        const coordinatesTs = `export const countryCoordinates = ${JSON.stringify(coordinates, null, 2)};`;

        fs.writeFileSync(
            path.join(__dirname, '../constants/CountryCoordinates.ts'),
            coordinatesTs
        );

        // 3. Update continents with complete country list
        console.log('3. Updating continents classification...');
        const continents = {
            "Europe": {
                name: "Europe",
                color: "#FF6384",
                countries: [
                    "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herz.",
                    "Bulgaria", "Croatia", "Czechia", "Denmark", "Estonia", "Faeroe Is.", "Finland",
                    "France", "Germany", "Greece", "Guernsey", "Hungary", "Iceland", "Ireland",
                    "Isle of Man", "Italy", "Jersey", "Kosovo", "Latvia", "Liechtenstein",
                    "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco",
                    "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania",
                    "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden",
                    "Switzerland", "Ukraine", "United Kingdom", "Vatican", "Åland"
                ]
            },
            "Asia": {
                name: "Asia",
                color: "#36A2EB",
                countries: [
                    "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan",
                    "Brunei", "Cambodia", "China", "Cyprus", "Georgia", "Hong Kong", "India",
                    "Indonesia", "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan",
                    "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Macao", "Malaysia", "Maldives",
                    "Mongolia", "Myanmar", "N. Cyprus", "Nepal", "North Korea", "Oman", "Pakistan",
                    "Palestine", "Philippines", "Qatar", "Saudi Arabia", "Siachen Glacier",
                    "Singapore", "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan",
                    "Thailand", "Timor-Leste", "Turkey", "Turkmenistan", "United Arab Emirates",
                    "Uzbekistan", "Vietnam", "Yemen", "Br. Indian Ocean Ter.", "Indian Ocean Ter."
                ]
            },
            "Africa": {
                name: "Africa",
                color: "#FFCE56",
                countries: [
                    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
                    "Cameroon", "Cabo Verde", "Central African Rep.", "Chad", "Comoros",
                    "Congo", "Dem. Rep. Congo", "Djibouti", "Egypt", "Eq. Guinea", "Eritrea",
                    "eSwatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau",
                    "Côte d'Ivoire", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
                    "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique",
                    "Namibia", "Niger", "Nigeria", "Rwanda", "São Tomé and Principe", "Senegal",
                    "Seychelles", "Sierra Leone", "Somalia", "Somaliland", "South Africa",
                    "S. Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "W. Sahara",
                    "Zambia", "Zimbabwe", "Saint Helena"
                ]
            },
            "North America": {
                name: "North America",
                color: "#4BC0C0",
                countries: [
                    "Antigua and Barb.", "Bahamas", "Barbados", "Belize", "Canada",
                    "Costa Rica", "Cuba", "Dominica", "Dominican Rep.", "El Salvador",
                    "Grenada", "Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico",
                    "Nicaragua", "Panama", "St. Kitts and Nevis", "Saint Lucia",
                    "St. Vin. and Gren.", "Trinidad and Tobago", "United States of America",
                    "Puerto Rico", "U.S. Virgin Is.", "Sint Maarten", "St-Martin",
                    "Greenland", "Bermuda", "Cayman Is.", "Montserrat", "Turks and Caicos Is.",
                    "Anguilla", "Aruba", "British Virgin Is.", "Curaçao", "St-Barthélemy",
                    "St. Pierre and Miquelon"
                ]
            },
            "South America": {
                name: "South America",
                color: "#9966FF",
                countries: [
                    "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador",
                    "Falkland Is.", "Fr. S. Antarctic Lands", "Guyana", "Paraguay", "Peru",
                    "S. Geo. and the Is.", "Suriname", "Uruguay", "Venezuela"
                ]
            },
            "Oceania": {
                name: "Oceania",
                color: "#FF9F40",
                countries: [
                    "American Samoa", "Australia", "Cook Is.", "Fiji", "Fr. Polynesia",
                    "Guam", "Heard I. and McDonald Is.", "Kiribati", "Marshall Is.", "Micronesia",
                    "Nauru", "New Caledonia", "New Zealand", "Niue", "N. Mariana Is.",
                    "Norfolk Island", "Palau", "Papua New Guinea", "Pitcairn Is.", "Samoa",
                    "Solomon Is.", "Tonga", "Vanuatu", "Wallis and Futuna Is."
                ]
            },
            "Antarctica": {
                name: "Antarctica",
                color: "#999999",
                countries: [
                    "Antarctica"
                ]
            }
        };

        const continentsTs = `export type Continent = {
    name: string;
    countries: string[];
    color: string;
};

export const continents: Record<string, Continent> = ${JSON.stringify(continents, null, 4)};`;

        fs.writeFileSync(
            path.join(__dirname, '../constants/Continents.ts'),
            continentsTs
        );

        // Create a backup of the original files
        if (fs.existsSync(path.join(__dirname, '../assets/world-110m.json'))) {
            fs.copyFileSync(
                path.join(__dirname, '../assets/world-110m.json'),
                path.join(__dirname, '../assets/world-110m.backup.json')
            );
        }
        if (fs.existsSync(path.join(__dirname, '../constants/Continents.ts'))) {
            fs.copyFileSync(
                path.join(__dirname, '../constants/Continents.ts'),
                path.join(__dirname, '../constants/Continents.backup.ts')
            );
        }
        if (fs.existsSync(path.join(__dirname, '../constants/CountryCoordinates.ts'))) {
            fs.copyFileSync(
                path.join(__dirname, '../constants/CountryCoordinates.ts'),
                path.join(__dirname, '../constants/CountryCoordinates.backup.ts')
            );
        }

        console.log('\nUpdate complete! New files have been created and backups made of the originals.');
        console.log('\nPlease review the following files:');
        console.log('1. assets/world-50m.json - New map data');
        console.log('2. constants/CountryCoordinates.ts - Updated coordinates');
        console.log('3. constants/Continents.ts - Updated continent classifications');
        console.log('\nBackups of original files have been created with .backup extension');

    } catch (error) {
        console.error('Error updating map data:', error);
    }
}

updateMapData();