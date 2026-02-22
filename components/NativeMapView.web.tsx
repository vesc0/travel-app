import { SimpleWorldMap } from '@/components/SimpleWorldMap';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

interface NativeMapViewProps {
    selected: string[];
    visitedFillColor: string;
    visitedFillColorWithAlpha: string;
    width: number;
    height: number;
}

// Web fallback: renders a full-screen SVG world map instead of react-native-maps.
export default function NativeMapView({
    selected,
    visitedFillColor,
    width,
    height,
}: NativeMapViewProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Fill the full viewport – no card wrapper, no padding
    const mapHeight = Math.max(0, height - 56); // subtract tab bar height, clamp to 0

    return (
        <View style={[styles.wrapper, { backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0' }]}>
            <SimpleWorldMap
                visitedCountries={selected}
                visitedColor={visitedFillColor}
                height={mapHeight}
                width={width}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
