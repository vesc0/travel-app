import worldData from '@/assets/world-110m.json';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { feature } from 'topojson-client';

type CountryFeature = GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon,
    { name: string }
>;

export default function CountrySelectionScreen() {
    const colorScheme = useColorScheme();
    const { selected, toggleCountry } = useCountries();

    const [countries, setCountries] = useState<CountryFeature[]>([]);

    useEffect(() => {
        const geojson = feature(
            worldData as any,
            worldData.objects.countries
        ) as GeoJSON.FeatureCollection<
            GeoJSON.Polygon | GeoJSON.MultiPolygon,
            { name: string }
        >;
        setCountries(geojson.features as CountryFeature[]);
    }, []);

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>
                Select Visited Countries
            </ThemedText>

            <FlatList
                data={countries}
                keyExtractor={(item) => item.properties.name}
                renderItem={({ item }) => {
                    const name = item.properties.name;
                    const isSelected = selected.includes(name);
                    return (
                        <TouchableOpacity
                            onPress={() => toggleCountry(name)}
                            style={styles.item}
                        >
                            <ThemedText
                                style={{
                                    color: isSelected
                                        ? 'green'
                                        : colorScheme === 'dark'
                                            ? 'white'
                                            : 'black',
                                }}
                            >
                                {isSelected ? '✔ ' : ''}
                                {name}
                            </ThemedText>
                        </TouchableOpacity>
                    );
                }}
            />

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingVertical: 60, paddingHorizontal: 30 },
    title: { marginBottom: 20 },
    item: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
