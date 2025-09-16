import worldData from '@/assets/world-110m.json';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountries } from '@/contexts/CountryContext';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { feature } from 'topojson-client';

type CountryProperties = { name: string };
type CountryFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, CountryProperties>;

export default function MapScreen() {
    const { selected } = useCountries();
    const [countries, setCountries] = useState<CountryFeature[]>([]);

    useEffect(() => {
        const geojson = feature(
            worldData as any,
            worldData.objects.countries
        ) as GeoJSON.FeatureCollection<
            GeoJSON.Polygon | GeoJSON.MultiPolygon,
            CountryProperties
        >;

        setCountries(geojson.features as CountryFeature[]);
    }, []);

    const isVisited = (country: CountryFeature) =>
        selected.includes(country.properties.name);

    const { width } = Dimensions.get('window');
    const mapHeight = 300;

    // Simple equirectangular projection
    const scaleX = width / 360;
    const scaleY = mapHeight / 180;
    const project = ([lon, lat]: [number, number]) => [
        (lon + 180) * scaleX,
        (90 - lat) * scaleY,
    ];

    // Generate SVG path from Polygon / MultiPolygon
    const pathData = (geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon) => {
        if (geometry.type === 'Polygon') {
            return geometry.coordinates
                .map(
                    (polygon) =>
                        'M' +
                        polygon
                            .map((point) => project(point as [number, number]).join(','))
                            .join('L') +
                        'Z'
                )
                .join(' ');
        } else if (geometry.type === 'MultiPolygon') {
            return geometry.coordinates
                .map((multi) =>
                    multi
                        .map(
                            (polygon) =>
                                'M' +
                                polygon
                                    .map((point) =>
                                        project(point as [number, number]).join(',')
                                    )
                                    .join('L') +
                                'Z'
                        )
                        .join(' ')
                )
                .join(' ');
        }
        return '';
    };

    return (
        <ScrollView>
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.title}>
                    Visited Countries Map
                </ThemedText>
                <Svg width={width} height={mapHeight}>
                    {countries.map((country) => (
                        <Path
                            key={country.properties.name}
                            d={pathData(country.geometry)}
                            fill={isVisited(country) ? 'green' : '#eee'}
                            stroke="#000"
                            strokeWidth={0.5}
                        />
                    ))}
                </Svg>
                {selected.length === 0 && (
                    <ThemedText style={{ marginTop: 10 }}>
                        No countries selected.
                    </ThemedText>
                )}
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingVertical: 60, paddingHorizontal: 30 },
    title: { marginBottom: 20 },
});
