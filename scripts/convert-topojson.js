const fs = require('fs');
const topojson = require('topojson-client');

// Read the TopoJSON file
const worldData = JSON.parse(fs.readFileSync('./assets/world-110m.json', 'utf8'));

// Convert TopoJSON to GeoJSON
const geojson = topojson.feature(worldData, worldData.objects.countries);

// Convert GeoJSON coordinates to the format needed for react-native-maps
const countryCoordinates = {};

geojson.features.forEach(feature => {
    const countryName = feature.properties.name;
    if (!countryName) return;

    const polygons = [];

    // Handle both Polygon and MultiPolygon
    if (feature.geometry.type === 'Polygon') {
        // Single polygon
        polygons.push(
            feature.geometry.coordinates[0].map(coord => ({
                latitude: coord[1],
                longitude: coord[0]
            }))
        );
    } else if (feature.geometry.type === 'MultiPolygon') {
        // Multiple polygons
        feature.geometry.coordinates.forEach(polygon => {
            polygons.push(
                polygon[0].map(coord => ({
                    latitude: coord[1],
                    longitude: coord[0]
                }))
            );
        });
    }

    countryCoordinates[countryName] = polygons;
});

// Generate TypeScript file
const tsContent = `export type Coordinate = {
    latitude: number;
    longitude: number;
};

export type CountryPolygons = Array<Array<Coordinate>>;

export const countryCoordinates: Record<string, CountryPolygons> = ${JSON.stringify(countryCoordinates, null, 2)};
`;

// Write the TypeScript file
fs.writeFileSync('./constants/CountryCoordinates.ts', tsContent);

console.log('Conversion complete! CountryCoordinates.ts has been updated with all country coordinates.');