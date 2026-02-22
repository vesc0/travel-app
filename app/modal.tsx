import worldData from '@/assets/world-50m.json';
import CountryItem from '@/components/CountryItem';
import { ThemedView } from '@/components/ThemedView';
import { continents } from '@/constants/Continents';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { feature } from 'topojson-client';

const isWeb = Platform.OS === 'web';

type CountryFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, { name: string }>;

export default function SelectCountriesModal() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { selected, setSelectedCountries } = useCountries();
    const { width } = useWindowDimensions();

    const [countries, setCountries] = useState<CountryFeature[]>([]);
    const [search, setSearch] = useState('');
    const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
    const [tempSelected, setTempSelected] = useState<string[]>(() => selected);

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

    const handleToggleCountry = useCallback((name: string) => {
        setTempSelected((prev) =>
            prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
        );
    }, []);

    const handleSaveChanges = () => {
        setSelectedCountries(tempSelected);
        router.back();
    };

    const filteredCountries = useMemo(() => countries.filter((c) => {
        const matchesSearch = c.properties.name.toLowerCase().includes(search.toLowerCase());

        if (!selectedContinent) {
            return matchesSearch;
        }

        const continentData = continents[selectedContinent];
        const isInContinent = continentData.countries.includes(c.properties.name);
        return matchesSearch && isInContinent;
    }), [countries, search, selectedContinent]);

    const renderItem = useCallback(({ item }: { item: CountryFeature }) => (
        <CountryItem
            name={item.properties.name}
            isSelected={tempSelected.includes(item.properties.name)}
            onToggle={handleToggleCountry}
            textColor={isDark ? '#fff' : '#000'}
        />
    ), [tempSelected, isDark, handleToggleCountry]);

    const keyExtractor = useCallback((item: CountryFeature) => item.properties.name, []);

    const selectedCount = tempSelected.length;

    const content = (
        <View style={[
            styles.innerContainer,
            isWeb && styles.popupCard,
            isWeb && {
                backgroundColor: isDark ? '#1e1e1e' : '#fff',
                // @ts-ignore – web-only
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            },
        ]}>
            {/* Header (web only, since native uses stack header) */}
            {isWeb && (
                <View style={[styles.popupHeader, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
                    <Text style={[styles.popupTitle, { color: isDark ? '#fff' : '#000' }]}>
                        Select Countries
                    </Text>
                    <TouchableOpacity onPress={() => router.back()} style={webCss.pointer}>
                        <MaterialIcons name="close" size={24} color={isDark ? '#aaa' : '#666'} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Search */}
            <View style={[
                styles.searchContainer,
                { backgroundColor: isDark ? '#333' : '#f0f0f0' },
                isWeb && styles.searchContainerWeb,
            ]}>
                <MaterialIcons name="search" size={20} color={isDark ? '#999' : '#888'} />
                <TextInput
                    placeholder="Search countries..."
                    placeholderTextColor={isDark ? '#999' : '#aaa'}
                    value={search}
                    onChangeText={setSearch}
                    style={[
                        styles.searchInput,
                        { color: isDark ? '#fff' : '#000' },
                        isWeb && styles.searchInputWeb,
                        isWeb && webCss.searchInput,
                    ]}
                />
            </View>

            {/* Continent filters */}
            {isWeb ? (
                <View style={[styles.continentContainer, styles.continentContainerWebWrap]}>
                    <TouchableOpacity
                        onPress={() => setSelectedContinent(null)}
                        style={[
                            styles.continentButton,
                            webCss.button,
                            {
                                backgroundColor: selectedContinent === null
                                    ? (isDark ? '#0a7f6f' : '#00bfa5')
                                    : (isDark ? '#333' : '#e0e0e0'),
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.continentButtonText,
                                {
                                    color: selectedContinent === null
                                        ? '#fff'
                                        : (isDark ? '#aaa' : '#333'),
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
                                webCss.button,
                                {
                                    backgroundColor: selectedContinent === continent.name
                                        ? continent.color
                                        : (isDark ? '#333' : '#e0e0e0'),
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.continentButtonText,
                                    {
                                        color: selectedContinent === continent.name
                                            ? '#fff'
                                            : (isDark ? '#aaa' : '#333'),
                                    },
                                ]}
                            >
                                {continent.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
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
                                    ? (isDark ? '#0a7f6f' : '#00bfa5')
                                    : (isDark ? '#333' : '#e0e0e0'),
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.continentButtonText,
                                {
                                    color: selectedContinent === null
                                        ? '#fff'
                                        : (isDark ? '#aaa' : '#333'),
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
                                        : (isDark ? '#333' : '#e0e0e0'),
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.continentButtonText,
                                    {
                                        color: selectedContinent === continent.name
                                            ? '#fff'
                                            : (isDark ? '#aaa' : '#333'),
                                    },
                                ]}
                            >
                                {continent.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Country list */}
            <FlatList
                data={filteredCountries}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                initialNumToRender={20}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={!isWeb}
                style={styles.list}
            />

            {/* Save button */}
            <View style={[
                styles.saveContainer,
                isWeb && styles.saveContainerWeb,
                { borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
            ]}>
                <Text style={[
                    styles.selectedCountText,
                    { color: isDark ? '#aaa' : '#666' },
                ]}>
                    {selectedCount} {selectedCount === 1 ? 'country' : 'countries'} selected
                </Text>
                <TouchableOpacity
                    onPress={handleSaveChanges}
                    style={[
                        styles.saveButton,
                        { backgroundColor: isDark ? '#0a7f6f' : '#00bfa5' },
                        isWeb && styles.saveButtonWeb,
                        isWeb && webCss.pointer,
                    ]}
                >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (isWeb) {
        return (
            <Pressable
                style={styles.webOverlay}
                onPress={() => router.back()}
            >
                <Pressable
                    style={styles.webPopupContainer}
                    onPress={(e) => e.stopPropagation()}
                >
                    {content}
                </Pressable>
            </Pressable>
        );
    }

    return (
        <ThemedView style={styles.container}>
            {content}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    webPopupContainer: {
        width: '90%',
        maxWidth: 760,
        maxHeight: '85%',
        borderRadius: 16,
        overflow: 'hidden',
    },
    popupCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    popupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    innerContainer: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    searchContainerWeb: {
        marginHorizontal: 20,
        borderRadius: 10,
        paddingHorizontal: 16,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    searchInputWeb: {
        fontSize: 15,
    },
    continentScroll: {
        flexGrow: 0,
    },
    continentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    continentContainerWebWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
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
    list: {
        flex: 1,
    },
    saveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 80 : 12,
        borderTopWidth: 1,
    },
    saveContainerWeb: {
        paddingBottom: 16,
        paddingHorizontal: 20,
    },
    selectedCountText: {
        fontSize: 14,
        fontWeight: '500',
    },
    saveButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonWeb: {
        borderRadius: 10,
        paddingHorizontal: 32,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

// Web-only CSS properties kept outside StyleSheet.create to avoid type widening
const webCss = {
    searchInput: { outlineStyle: 'none' } as any,
    button: { cursor: 'pointer', transition: 'opacity 0.15s ease' } as any,
    pointer: { cursor: 'pointer' } as any,
};