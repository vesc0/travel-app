import { SimpleWorldMap } from '@/components/SimpleWorldMap';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { continents } from '@/constants/Continents';
import { countryCoordinates } from '@/constants/CountryCoordinates';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const availableCountries = new Set(Object.keys(countryCoordinates));

export default function StatsScreen() {
    const colorScheme = useColorScheme();
    const { selected, visitedFillColor } = useCountries();
    const { width } = useWindowDimensions();

    const stats = useMemo(() => {
        // Filter selected countries to only include those with coordinates
        const validSelected = selected.filter(country => availableCountries.has(country));
        const validSelectedSet = new Set(validSelected);

        const totalCountries = availableCountries.size;
        const visitedCount = validSelected.length;
        const percentage = ((visitedCount / totalCountries) * 100).toFixed(1);

        const continentStats = Object.values(continents).map(continent => {
            // Filter to only include countries that exist in coordinates data
            const validCountries = continent.countries.filter(country =>
                availableCountries.has(country)
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

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
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
                        <View style={[styles.card, styles.cardNoPadding]}>
                            <SimpleWorldMap
                                visitedCountries={stats.visitedCountries}
                                visitedColor={visitedFillColor}
                                height={250}
                            />
                        </View>

                        {/* Overall Progress - Donut Chart */}
                        <View style={styles.card}>
                            <ThemedText style={styles.cardTitle}>Overall Progress</ThemedText>
                            <View style={styles.donutContainer}>
                                {/* Left side - Visited countries */}
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

                                {/* Center - Donut Chart */}
                                <View style={styles.donutCenter}>
                                    <Svg width={100} height={100} viewBox="0 0 100 100">
                                        {/* Background circle */}
                                        <Circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke={colorScheme === 'dark' ? '#333333' : '#e0e0e0'}
                                            strokeWidth="10"
                                        />
                                        {/* Visited circle - drawn as arc using circumference */}
                                        <Circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke={visitedFillColor}
                                            strokeWidth="10"
                                            strokeDasharray={`${(stats.visited / stats.total) * 251.2} 251.2`}
                                            strokeDashoffset="0"
                                            strokeLinecap="round"
                                            transform="rotate(-90 50 50)"
                                        />
                                    </Svg>
                                </View>

                                {/* Right side - Global coverage */}
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
                        {stats.continentStats.length > 0 ? (
                            <View style={styles.card}>
                                <ThemedText style={styles.cardTitle}>Continental Breakdown</ThemedText>
                                {stats.continentStats.map((continent) => (
                                    <View key={continent.name} style={styles.continentDonutContainer}>
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
                                                {/* Background circle */}
                                                <Circle
                                                    cx="50"
                                                    cy="50"
                                                    r="40"
                                                    fill="none"
                                                    stroke={colorScheme === 'dark' ? '#333333' : '#e0e0e0'}
                                                    strokeWidth="10"
                                                />
                                                {/* Visited circle - drawn as arc using circumference */}
                                                {continent.total > 0 && (
                                                    <Circle
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        fill="none"
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
                                ))}
                            </View>
                        ) : null}
                    </>
                )}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        padding: 16,
        paddingRight: 24,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
    },
    cardNoPadding: {
        padding: 0,
        paddingEnd: 0,
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
    statText: {
        fontSize: 16,
        marginBottom: 8,
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
    donutSubtext: {
        fontSize: 11,
        opacity: 0.6,
    },
    continentDonutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    continentDonutSide: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    continentStat: {
        marginBottom: 12,
    },
    continentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    continentName: {
        fontSize: 16,
        fontWeight: '500',
    },
    statDetail: {
        fontSize: 14,
        marginLeft: 20,
        opacity: 0.8,
    },
    noDataText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 40,
        opacity: 0.7,
    },
});