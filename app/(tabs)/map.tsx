import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountries } from '@/contexts/CountryContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import MapView, { Polygon, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { countryCoordinates, CountryPolygons } from '../../constants/CountryCoordinates';

export default function MapScreen() {
    const { selected } = useCountries();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { width, height } = Dimensions.get('window');
    const mapHeight = height * 0.75; // 75% of screen height

    // Colors based on color scheme
    const containerBackgroundColor = colorScheme === 'dark' ? '#121212' : '#fff';
    const visitedFillColor = 'rgba(0, 191, 165, 0.3)'; // Semi-transparent teal
    const visitedStrokeColor = '#00bfa5';
    const unvisitedFillColor = colorScheme === 'dark' ? 'rgba(55, 71, 79, 0.3)' : 'rgba(207, 216, 220, 0.3)';
    const unvisitedStrokeColor = colorScheme === 'dark' ? '#455a64' : '#90a4ae';
    const textColor = colorScheme === 'dark' ? '#fff' : '#000';
    const buttonBackground = colorScheme === 'dark' ? '#008080' : 'blue';

    return (
        <ThemedView style={[styles.container, { backgroundColor: containerBackgroundColor }]}>
            <MapView
                style={[styles.map, { width, height: mapHeight }]}
                provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
                mapType="standard"
                rotateEnabled={true}
                pitchEnabled={true}
                zoomEnabled={true}
                scrollEnabled={true}
                initialRegion={{
                    latitude: 20,
                    longitude: 0,
                    latitudeDelta: 180,
                    longitudeDelta: 180
                }}
                minZoomLevel={1}
            >
                {Object.entries(countryCoordinates).map(([countryName, polygons]: [string, CountryPolygons]) => {
                    const isVisited = selected.includes(countryName);
                    return polygons.map((coordinates, index) => (
                        <Polygon
                            key={`${countryName}-${index}`}
                            coordinates={coordinates}
                            fillColor={isVisited ? visitedFillColor : unvisitedFillColor}
                            strokeColor={isVisited ? visitedStrokeColor : unvisitedStrokeColor}
                            strokeWidth={isVisited ? 2 : 1}
                        />
                    ));
                })}
            </MapView>

            <ThemedView style={styles.bottomContainer}>
                {selected.length === 0 ? (
                    <ThemedText style={[styles.stats, { color: textColor }]}>
                        No countries visited yet.
                    </ThemedText>
                ) : (
                    <ThemedText style={[styles.stats, { color: textColor }]}>
                        Visited: {selected.length}/{Object.keys(countryCoordinates).length}
                    </ThemedText>
                )}

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: buttonBackground }]}
                    onPress={() => router.push('/select')}
                >
                    <ThemedText style={styles.buttonText}>Add Countries</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        overflow: 'hidden'
    },
    bottomContainer: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        alignItems: 'center',
    },
    stats: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center'
    },
    button: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
});
