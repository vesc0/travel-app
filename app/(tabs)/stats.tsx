import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { continents } from '@/constants/Continents';
import { countryCoordinates } from '@/constants/CountryCoordinates';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export default function StatsScreen() {
    const colorScheme = useColorScheme();
    const { selected } = useCountries();
    const { width } = useWindowDimensions();

    const stats = useMemo(() => {
        // Get all available countries from coordinates data
        const availableCountries = new Set(Object.keys(countryCoordinates));

        // Filter selected countries to only include those with coordinates
        const validSelected = selected.filter(country => availableCountries.has(country));

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
                validSelected.includes(country)
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
            continentStats
        };
    }, [selected]);

    const chartConfig = {
        backgroundGradientFrom: colorScheme === 'dark' ? '#121212' : '#ffffff',
        backgroundGradientTo: colorScheme === 'dark' ? '#121212' : '#ffffff',
        color: (opacity = 1) =>
            colorScheme === 'dark'
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) =>
            colorScheme === 'dark'
                ? `rgba(255, 255, 255, ${opacity})`
                : `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
    };

    const pieData = stats.continentStats.map(stat => ({
        name: stat.name,
        population: stat.visited,
        color: stat.color,
        legendFontColor: colorScheme === 'dark' ? '#fff' : '#000',
        legendFontSize: 12
    }));

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <ThemedText type="title" style={styles.title}>
                    Travel Statistics
                </ThemedText>

                {/* Overall Progress */}
                <View style={styles.card}>
                    <ThemedText style={styles.cardTitle}>Overall Progress</ThemedText>
                    <ThemedText style={styles.statText}>
                        Countries Visited: {stats.visited} / {stats.total}
                    </ThemedText>
                    <ThemedText style={styles.statText}>
                        Global Coverage: {stats.percentage}%
                    </ThemedText>
                </View>

                {/* Continents Breakdown */}
                <View style={styles.card}>
                    <ThemedText style={styles.cardTitle}>Continental Breakdown</ThemedText>
                    {stats.visited > 0 ? (
                        <PieChart
                            data={pieData}
                            width={width - 48}
                            height={250}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="20"
                            center={[10, -10]}
                            absolute
                        />
                    ) : (
                        <ThemedText style={styles.noDataText}>
                            No countries visited yet to show continental breakdown.
                        </ThemedText>
                    )}
                </View>

                {/* Detailed Stats per Continent */}
                <View style={styles.card}>
                    <ThemedText style={styles.cardTitle}>Detailed Statistics</ThemedText>
                    {stats.visited > 0 ? (
                        stats.continentStats.map(stat => (
                            <View key={stat.name} style={styles.continentStat}>
                                <View style={styles.continentHeader}>
                                    <View
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: stat.color }
                                        ]}
                                    />
                                    <ThemedText style={styles.continentName}>
                                        {stat.name}
                                    </ThemedText>
                                </View>
                                <ThemedText style={styles.statDetail}>
                                    {stat.visited} / {stat.total} countries ({stat.percentage}%)
                                </ThemedText>
                            </View>
                        ))
                    ) : (
                        <ThemedText style={styles.noDataText}>
                            No countries visited yet to show detailed statistics.
                        </ThemedText>
                    )}
                </View>
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
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    statText: {
        fontSize: 16,
        marginBottom: 8,
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