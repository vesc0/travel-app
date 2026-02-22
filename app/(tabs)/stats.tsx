import worldData from '@/assets/world-50m.json';
import { SimpleWorldMap } from '@/components/SimpleWorldMap';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { continents } from '@/constants/Continents';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { feature } from 'topojson-client';

const isWeb = Platform.OS === 'web';

const geojson = feature(
    worldData as any,
    worldData.objects.countries
) as GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, { name: string }>;
const allCountryNames = new Set(geojson.features.map(f => f.properties.name));

export default function StatsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { selected, visitedFillColor } = useCountries();
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // Responsive: on wide screens show continent cards in a 2-column grid
    const useGrid = isWeb && width > 768;

    // Map width for the SimpleWorldMap inside the card (accounting for card padding + scroll padding)
    const contentMaxWidth = isWeb ? 800 : width;
    const mapContainerWidth = Math.min(width - 32, contentMaxWidth) - 32; // subtract card padding

    const stats = useMemo(() => {
        const validSelected = selected.filter(country => allCountryNames.has(country));
        const validSelectedSet = new Set(validSelected);

        const totalCountries = allCountryNames.size;
        const visitedCount = validSelected.length;
        const percentage = ((visitedCount / totalCountries) * 100).toFixed(1);

        const continentStats = Object.values(continents).map(continent => {
            const validCountries = continent.countries.filter(country =>
                allCountryNames.has(country)
            );
            const continentTotal = validCountries.length;
            const continentVisited = validCountries.filter(country =>
                validSelectedSet.has(country)
            ).length;
            const continentPercentage = continentTotal > 0
                ? ((continentVisited / continentTotal) * 100).toFixed(1)
                : "0.0";

            return {
                name: continent.name,
                total: continentTotal,
                visited: continentVisited,
                percentage: continentPercentage,
                color: continent.color
            };
        });

        return {
            total: totalCountries,
            visited: visitedCount,
            percentage,
            visitedCountries: validSelected,
            continentStats
        };
    }, [selected]);

    const topPadding = isWeb ? 32 : insets.top + 8;

    const cardStyle = (extra?: object) => [
        styles.card,
        isWeb && {
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            // @ts-ignore
            boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)',
        },
        extra,
    ];

    // On iOS the tab bar floats (position absolute), so content needs extra bottom padding to clear it
    const bottomPadding = Platform.OS === 'ios' ? insets.bottom + 50 : 32;

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: topPadding, paddingBottom: bottomPadding },
                    isWeb && { maxWidth: 800, alignSelf: 'center', width: '100%' },
                ]}
            >
                <ThemedText type="title" style={styles.title}>
                    Travel Statistics
                </ThemedText>

                {stats.visited === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <ThemedText style={styles.noDataText}>
                            No countries visited yet to show statistics.
                        </ThemedText>
                    </View>
                ) : (
                    <>
                        {/* World Map */}
                        <View style={cardStyle({ padding: 0, paddingEnd: 0 })}>
                            <SimpleWorldMap
                                visitedCountries={stats.visitedCountries}
                                visitedColor={visitedFillColor}
                                height={isWeb ? Math.min(350, width * 0.4) : 250}
                                width={isWeb ? mapContainerWidth : undefined}
                            />
                        </View>

                        {/* Overall Progress */}
                        <View style={cardStyle()}>
                            <ThemedText style={styles.cardTitle}>Overall Progress</ThemedText>
                            <View style={styles.donutContainer}>
                                <View style={styles.donutSide}>
                                    <View style={{ flexDirection: "row" }}>
                                        <ThemedText style={[styles.donutValue, { color: visitedFillColor }]}>
                                            {stats.visited}
                                        </ThemedText>
                                        <ThemedText style={[styles.donutValue, { color: "#888" }]}>
                                            /{stats.total}
                                        </ThemedText>
                                    </View>
                                    <ThemedText style={styles.donutLabel}>
                                        Countries
                                    </ThemedText>
                                </View>

                                <View style={styles.donutCenter}>
                                    <Svg width={100} height={100} viewBox="0 0 100 100">
                                        <Circle
                                            cx="50" cy="50" r="40" fill="none"
                                            stroke={isDark ? '#333333' : '#e0e0e0'}
                                            strokeWidth="10"
                                        />
                                        <Circle
                                            cx="50" cy="50" r="40" fill="none"
                                            stroke={visitedFillColor}
                                            strokeWidth="10"
                                            strokeDasharray={`${(stats.visited / stats.total) * 251.2} 251.2`}
                                            strokeDashoffset="0"
                                            strokeLinecap="round"
                                            transform="rotate(-90 50 50)"
                                        />
                                    </Svg>
                                </View>

                                <View style={styles.donutSide}>
                                    <ThemedText style={[styles.donutValue, { color: visitedFillColor }]}>
                                        {Math.round(parseFloat(stats.percentage))}%
                                    </ThemedText>
                                    <ThemedText style={styles.donutLabel}>
                                        World
                                    </ThemedText>
                                </View>
                            </View>
                        </View>

                        {/* Continents Breakdown */}
                        {stats.continentStats.length > 0 && (
                            <View>
                                <ThemedText style={[styles.cardTitle, { marginBottom: 12, paddingHorizontal: 4 }]}>
                                    Continental Breakdown
                                </ThemedText>
                                <View style={useGrid ? styles.continentGrid : undefined}>
                                    {stats.continentStats.map((continent) => (
                                        <View
                                            key={continent.name}
                                            style={[
                                                ...cardStyle(),
                                                useGrid && styles.continentGridItem,
                                            ]}
                                        >
                                            <View style={styles.continentDonutContainer}>
                                                <View style={styles.continentDonutSide}>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <ThemedText style={[styles.donutValue, { color: continent.color }]}>
                                                            {continent.visited}
                                                        </ThemedText>
                                                        <ThemedText style={[styles.donutValue, { color: "#888" }]}>
                                                            /{continent.total}
                                                        </ThemedText>
                                                    </View>
                                                    <ThemedText style={styles.donutLabel}>
                                                        {continent.name}
                                                    </ThemedText>
                                                </View>

                                                <View style={styles.donutCenter}>
                                                    <Svg width={80} height={80} viewBox="0 0 100 100">
                                                        <Circle
                                                            cx="50" cy="50" r="40" fill="none"
                                                            stroke={isDark ? '#333333' : '#e0e0e0'}
                                                            strokeWidth="10"
                                                        />
                                                        {continent.total > 0 && (
                                                            <Circle
                                                                cx="50" cy="50" r="40" fill="none"
                                                                stroke={continent.color}
                                                                strokeWidth="10"
                                                                strokeDasharray={`${(continent.visited / continent.total) * 251.2} 251.2`}
                                                                strokeDashoffset="0"
                                                                strokeLinecap="round"
                                                                transform="rotate(-90 50 50)"
                                                            />
                                                        )}
                                                    </Svg>
                                                </View>

                                                <View style={styles.continentDonutSide}>
                                                    <ThemedText style={[styles.donutValue, { color: continent.color }]}>
                                                        {Math.round(parseFloat(continent.percentage))}%
                                                    </ThemedText>
                                                    <ThemedText style={styles.donutLabel}>
                                                        Coverage
                                                    </ThemedText>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    title: {
        fontSize: isWeb ? 28 : 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: isWeb ? 'left' : 'center',
    },
    card: {
        padding: 16,
        paddingRight: 24,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    donutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    donutSide: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    donutCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    donutValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    donutLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
        opacity: 0.8,
    },
    continentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    continentGridItem: {
        width: '48%',
        marginBottom: 0,
    },
    continentDonutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    continentDonutSide: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    noDataText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 40,
        opacity: 0.7,
    },
});