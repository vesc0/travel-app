import { countryCoordinates } from '@/constants/CountryCoordinates';
import { Coordinate, CountryPolygons } from '@/types/map';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';

// On Android, react-native-maps applies initialRegion with newLatLngBounds(bounds, 0),
// which throws "Map size can't be 0" (a fatal native crash) when Google Maps hasn't
// measured its view yet. A camera position doesn't depend on the map size.
// Android reads center, zoom, pitch and heading, so all of them must be set.
const initialPosition = Platform.OS === 'android'
    ? { initialCamera: { center: { latitude: 20, longitude: 0 }, zoom: 1, pitch: 0, heading: 0 } }
    : { initialRegion: { latitude: 20, longitude: 0, latitudeDelta: 180, longitudeDelta: 180 } };

interface NativeMapViewProps {
    selected: string[];
    visitedFillColor: string;
    visitedFillColorWithAlpha: string;
    width: number;
    height: number;
}

export default function NativeMapView({
    selected,
    visitedFillColor,
    visitedFillColorWithAlpha,
    width,
    height,
}: NativeMapViewProps) {
    const [mapReady, setMapReady] = React.useState(false);

    return (
        <MapView
            style={[styles.map, { width, height }]}
            provider={undefined}
            mapType="standard"
            rotateEnabled
            pitchEnabled
            zoomEnabled
            scrollEnabled
            {...initialPosition}
            minZoomLevel={1}
            onMapReady={() => setMapReady(true)}
        >
            {mapReady &&
                Object.entries(countryCoordinates).map(
                    ([countryName, polygons]: [string, CountryPolygons]) => {
                        const isVisited = selected.includes(countryName);
                        if (!isVisited) return null;
                        return polygons.map(
                            (coordinates: Coordinate[], index: number) => (
                                <Polygon
                                    key={`${countryName}-${index}`}
                                    coordinates={coordinates}
                                    fillColor={visitedFillColorWithAlpha}
                                    strokeColor={visitedFillColor}
                                    strokeWidth={2}
                                />
                            ),
                        );
                    },
                )}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        overflow: 'hidden',
    },
});
