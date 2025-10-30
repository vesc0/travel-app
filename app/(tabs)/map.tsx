import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountries } from '@/contexts/CountryContext';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import MapView, { Polygon, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { countryCoordinates } from '../../constants/CountryCoordinates';
import { Coordinate, CountryPolygons } from '../../types/map';

export default function MapScreen() {
    const { selected, visitedFillColor } = useCountries();
    const colorScheme = useColorScheme();
    const { width, height } = Dimensions.get('window');

    const handleAddCountries = () => {
        router.push('/modal');
    };

    // Colors based on color scheme
    const containerBackgroundColor = colorScheme === 'dark' ? '#121212' : '#fff';
    // Create semi-transparent version for fill
    const visitedFillColorWithAlpha = visitedFillColor + '4D'; // 30% opacity in hex
    const visitedStrokeColor = visitedFillColor;
    const unvisitedFillColor = colorScheme === 'dark' ? 'rgba(55, 71, 79, 0.3)' : 'rgba(207, 216, 220, 0.3)';
    const unvisitedStrokeColor = colorScheme === 'dark' ? '#455a64' : '#90a4ae';
    const textColor = colorScheme === 'dark' ? '#fff' : '#000';
    const buttonBackground = colorScheme === 'dark'
        ? 'rgba(255, 255, 255, 0.1)' // Light blur for dark mode
        : 'rgba(255, 255, 255, 0.6)'; // White blur for light mode

    return (
        <ThemedView style={[styles.container, { backgroundColor: containerBackgroundColor }]}>
            <BlurView
                intensity={50}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                style={styles.addButton}
            >
                <TouchableOpacity
                    style={styles.buttonContent}
                    onPress={handleAddCountries}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                    <ThemedText style={styles.buttonText}>Add Countries</ThemedText>
                </TouchableOpacity>
            </BlurView>
            <MapView
                style={[styles.map, { width, height }]}
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
                    return polygons.map((coordinates: Coordinate[], index: number) => (
                        <Polygon
                            key={`${countryName}-${index}`}
                            coordinates={coordinates}
                            fillColor={isVisited ? visitedFillColorWithAlpha : unvisitedFillColor}
                            strokeColor={isVisited ? visitedStrokeColor : unvisitedStrokeColor}
                            strokeWidth={isVisited ? 2 : 1}
                        />
                    ));
                })}
            </MapView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        top: 60,
        right: 16,
        borderRadius: 24,
        overflow: 'hidden',
        zIndex: 1,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    map: {
        width: '100%',
        overflow: 'hidden',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
