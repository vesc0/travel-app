import worldData from '@/assets/world-50m.json';
import CountryItem from '@/components/CountryItem';
import { ThemedView } from '@/components/ThemedView';
import { continents } from '@/constants/Continents';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { feature } from 'topojson-client';

type CountryFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, { name: string }>;

export default function SelectCountriesModal() {
    const colorScheme = useColorScheme();
    const { selected, toggleCountry } = useCountries();

    const [countries, setCountries] = useState<CountryFeature[]>([]);
    const [search, setSearch] = useState('');
    const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
    const [tempSelected, setTempSelected] = useState<string[]>([]);

    useEffect(() => {
        // Initialize tempSelected with current selected countries
        setTempSelected(selected);
    }, []);

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

    const handleToggleCountry = (name: string) => {
        setTempSelected((prev) =>
            prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
        );
    };

    const handleSaveChanges = () => {
        // Calculate differences and apply only changed items
        const added = tempSelected.filter((c) => !selected.includes(c));
        const removed = selected.filter((c) => !tempSelected.includes(c));

        [...added, ...removed].forEach((c) => toggleCountry(c));
        router.back()
    };

    const filteredCountries = countries.filter((c) => {
        const matchesSearch = c.properties.name.toLowerCase().includes(search.toLowerCase());

        if (!selectedContinent) {
            return matchesSearch;
        }

        const continentData = continents[selectedContinent];
        const isInContinent = continentData.countries.includes(c.properties.name);
        return matchesSearch && isInContinent;
    });

    const renderItem = useCallback(({ item }: { item: CountryFeature }) => (
        <CountryItem
            name={item.properties.name}
            isSelected={tempSelected.includes(item.properties.name)}
            onToggle={handleToggleCountry}
            textColor={colorScheme === 'dark' ? '#fff' : '#000'}
        />
    ), [tempSelected, colorScheme]);

    const keyExtractor = useCallback((item: CountryFeature) => item.properties.name, []);

    return (
        <ThemedView style={styles.container}>
            <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' }]}>
                <MaterialIcons name="search" size={20} color={colorScheme === 'dark' ? '#999' : '#888'} />
                <TextInput
                    placeholder="Search countries..."
                    placeholderTextColor={colorScheme === 'dark' ? '#999' : '#aaa'}
                    value={search}
                    onChangeText={setSearch}
                    style={[
                        styles.searchInput,
                        {
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                        },
                    ]}
                />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                style={styles.continentScroll}
                contentContainerStyle={styles.continentContainer}
            >
                <TouchableOpacity
                    onPress={() => setSelectedContinent(null)}
                    style={[
                        styles.continentButton,
                        {
                            backgroundColor: selectedContinent === null
                                ? (colorScheme === 'dark' ? '#0a7f6f' : '#00bfa5')
                                : (colorScheme === 'dark' ? '#333' : '#e0e0e0'),
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.continentButtonText,
                            {
                                color: selectedContinent === null
                                    ? '#fff'
                                    : (colorScheme === 'dark' ? '#aaa' : '#333'),
                            },
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                {Object.values(continents).map((continent) => (
                    <TouchableOpacity
                        key={continent.name}
                        onPress={() => setSelectedContinent(continent.name)}
                        style={[
                            styles.continentButton,
                            {
                                backgroundColor: selectedContinent === continent.name
                                    ? continent.color
                                    : (colorScheme === 'dark' ? '#333' : '#e0e0e0'),
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.continentButtonText,
                                {
                                    color: selectedContinent === continent.name ? '#fff' : (colorScheme === 'dark' ? '#aaa' : '#333'),
                                },
                            ]}
                        >
                            {continent.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={filteredCountries}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
            />

            <TouchableOpacity
                onPress={handleSaveChanges}
                style={[
                    styles.saveButton,
                    {
                        backgroundColor: colorScheme === 'dark' ? '#0a7f6f' : '#00bfa5',
                    },
                ]}
            >
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    continentScroll: {
        height: 60,
        flexGrow: 0,
    },
    continentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    continentButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        flexShrink: 0,
    },
    continentButtonText: {
        fontSize: 13,
        fontWeight: '500',
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
    saveButton: {
        marginHorizontal: 16,
        marginVertical: 12,
        marginBottom: 80,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});