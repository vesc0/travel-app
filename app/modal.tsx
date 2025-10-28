import worldData from '@/assets/world-110m.json';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { feature } from 'topojson-client';

type CountryFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, { name: string }>;

export default function SelectCountriesModal() {
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
            <TextInput
                placeholder="Search countries..."
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#555'}
                value={search}
                onChangeText={setSearch}
                style={[
                    styles.searchInput,
                    {
                        backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
                        color: colorScheme === 'dark' ? '#fff' : '#000',
                    },
                ]}
            />

            <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.properties.name}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.countryItem,
                            selected.includes(item.properties.name) && styles.selectedItem,
                        ]}
                        onPress={() => toggleCountry(item.properties.name)}
                    >
                        <ThemedText style={styles.countryName}>
                            {item.properties.name}
                        </ThemedText>
                        {selected.includes(item.properties.name) && (
                            <MaterialIcons
                                name="check"
                                size={24}
                                color={colorScheme === 'dark' ? '#fff' : '#000'}
                            />
                        )}
                    </TouchableOpacity>
                )}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    searchInput: {
        margin: 16,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    countryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    selectedItem: {
        backgroundColor: 'rgba(0, 191, 165, 0.1)',
    },
    countryName: {
        fontSize: 16,
    },
});