import worldData from '@/assets/world-110m.json';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { feature } from 'topojson-client';

type CountryFeature = GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon,
    { name: string }
>;

export default function CountrySelectionScreen() {
    const colorScheme = useColorScheme();
    const { selected, toggleCountry } = useCountries();

    const [countries, setCountries] = useState<CountryFeature[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const geojson = feature(
            worldData as any,
            worldData.objects.countries
        ) as GeoJSON.FeatureCollection<
            GeoJSON.Polygon | GeoJSON.MultiPolygon,
            { name: string }
        >;
        const sortedCountries = (geojson.features as CountryFeature[]).slice().sort((a, b) =>
            a.properties.name.localeCompare(b.properties.name)
        );
        setCountries(sortedCountries);
    }, []);

    const filteredCountries = countries.filter((c) =>
        c.properties.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>
                Select Visited Countries
            </ThemedText>

            <TextInput
                placeholder="Search countries..."
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#555'}
                value={search}
                onChangeText={setSearch}
                style={[
                    styles.search,
                    { color: colorScheme === 'dark' ? 'white' : 'black' },
                ]}
            />

            <FlatList
                data={filteredCountries}
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
    search: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
    },
    item: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
