import worldData from '@/assets/world-110m.json';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountries } from '@/contexts/CountryContext';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import { feature } from 'topojson-client';

type CountryProperties = { name: string };
type CountryFeature = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, CountryProperties>;

export default function MapScreen() {
    const { selected } = useCountries();
    const [countries, setCountries] = useState<CountryFeature[]>([]);
    const router = useRouter();
    const colorScheme = useColorScheme();

    useEffect(() => {
        const geojson = feature(
            worldData as any,
            worldData.objects.countries
        ) as GeoJSON.FeatureCollection<
            GeoJSON.Polygon | GeoJSON.MultiPolygon,
            CountryProperties
        >;

        setCountries(geojson.features as CountryFeature[]);
    }, []);

    const isVisited = (country: CountryFeature) =>
        selected.includes(country.properties.name);

    const { width } = Dimensions.get('window');
    const mapHeight = 300;

    const projection = geoEquirectangular().fitSize([width, mapHeight], { type: 'FeatureCollection', features: countries });
    const pathGenerator = geoPath().projection(projection);

    const getPath = (feature: CountryFeature) => pathGenerator(feature) || '';

    // --- Gesture/Zoom/Pan Logic ---
    // shared values for translation and scale
    const scale = useSharedValue(1);
    const lastScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const lastTranslateX = useSharedValue(0);
    const lastTranslateY = useSharedValue(0);

    // Pinch gesture using Gesture API
    const pinchGesture = Gesture.Pinch()
        .onStart(() => {
            lastScale.value = scale.value;
        })
        .onUpdate((event) => {
            scale.value = lastScale.value * event.scale;
        })
        .onEnd(() => {
            if (scale.value < 1) scale.value = withTiming(1);
            if (scale.value > 8) scale.value = withTiming(8);
            lastScale.value = scale.value;
        });

    // Pan gesture using Gesture API
    const panGesture = Gesture.Pan()
        .minDistance(5)
        .averageTouches(true)
        .onStart(() => {
            lastTranslateX.value = translateX.value;
            lastTranslateY.value = translateY.value;
        })
        .onUpdate((event) => {
            translateX.value = lastTranslateX.value + event.translationX;
            translateY.value = lastTranslateY.value + event.translationY;
        })
        .onEnd(() => {
            lastTranslateX.value = translateX.value;
            lastTranslateY.value = translateY.value;
        });

    const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    // Colors based on color scheme
    const containerBackgroundColor = colorScheme === 'dark' ? '#121212' : '#fff';
    const seaColor = colorScheme === 'dark' ? '#1e2a38' : '#b3d9ff'; // sea color inside map
    const unvisitedFill = colorScheme === 'dark' ? '#555' : '#e0e0e0'; // continents
    const visitedFill = '#4caf50';
    const strokeColor = colorScheme === 'dark' ? '#888' : '#aaa';
    const textColor = colorScheme === 'dark' ? '#fff' : '#000';
    const buttonBackground = colorScheme === 'dark' ? '#008080' : 'blue';

    return (
        <ThemedView style={[styles.container, { backgroundColor: containerBackgroundColor }]}>
            <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                Visited Countries Map
            </ThemedText>
            <ThemedView style={[styles.contentContainer, { backgroundColor: 'transparent' }]}>
                <GestureHandlerRootView style={styles.zoomableContainer}>
                    <GestureDetector gesture={composedGesture}>
                        <Animated.View style={[animatedStyle]}>
                            <Svg width={width} height={mapHeight} style={styles.svg}>
                                <Rect width={width} height={mapHeight} fill={seaColor} />
                                {countries.map((country) => (
                                    <Path
                                        key={country.properties.name}
                                        d={getPath(country)}
                                        fill={isVisited(country) ? visitedFill : unvisitedFill}
                                        stroke={strokeColor}
                                        strokeWidth={0.5}
                                    />
                                ))}
                            </Svg>
                        </Animated.View>
                    </GestureDetector>
                </GestureHandlerRootView>

                {selected.length === 0 && (
                    <ThemedText style={{ marginTop: 10, color: textColor, textAlign: 'center' }}>
                        No countries visited yet.
                    </ThemedText>
                )}

                {selected.length > 0 && (
                    <ThemedText style={[styles.stats, { color: textColor }]}>
                        Visited: {selected.length}/{countries.length}
                    </ThemedText>
                )}

                <TouchableOpacity style={[styles.button, { backgroundColor: buttonBackground }]} onPress={() => router.push('/select')}>
                    <ThemedText style={styles.buttonText}>Add Countries</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 30, paddingTop: 60 },
    title: { marginBottom: 20, textAlign: 'center' },
    contentContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
    stats: { marginTop: 16, fontSize: 16, textAlign: 'center' },
    button: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center',
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
    zoomableContainer: {
        width: '100%',
        overflow: 'hidden',
        minHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        alignSelf: 'center',
    },
});
