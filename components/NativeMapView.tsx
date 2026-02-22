import { countryCoordinates } from '@/constants/CountryCoordinates';
import { Coordinate, CountryPolygons } from '@/types/map';
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';

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
            initialRegion={{
                latitude: 20,
                longitude: 0,
                latitudeDelta: 180,
                longitudeDelta: 180,
            }}
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
