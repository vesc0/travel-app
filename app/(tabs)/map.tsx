import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { countryCoordinates } from '@/constants/CountryCoordinates';
import { useCountries } from '@/contexts/CountryContext';
import { Coordinate, CountryPolygons } from '@/types/map';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import MapView, { Polygon, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapScreen() {
    const { selected, visitedFillColor, visitedFillColorWithAlpha } = useCountries();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { width, height } = useWindowDimensions();

    const handleAddCountries = () => {
        router.push('/modal');
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
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
                    if (!isVisited) return null;
                    return polygons.map((coordinates: Coordinate[], index: number) => (
                        <Polygon
                            key={`${countryName}-${index}`}
                            coordinates={coordinates}
                            fillColor={visitedFillColorWithAlpha}
                            strokeColor={visitedFillColor}
                            strokeWidth={2}
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
