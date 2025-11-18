import { countryCoordinates } from '@/constants/CountryCoordinates';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { memo, useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Polygon, Rect } from 'react-native-svg';

interface SimpleWorldMapProps {
    visitedCountries: string[];
    visitedColor: string;
    height?: number;
}

const SimpleWorldMapComponent = ({
    visitedCountries,
    visitedColor,
    height = 200
}: SimpleWorldMapProps) => {
    const colorScheme = useColorScheme();
    const { width } = useWindowDimensions();

    // Calculate scaling to fit all countries in the view
    const mapWidth = width - 32; // Account for padding
    const mapHeight = height;
    // Use proper aspect ratio: latitude range is -90 to 90 (180 degrees), longitude is -180 to 180 (360 degrees)
    const scaleX = mapWidth / 360; // Longitude range
    const scaleY = mapHeight / 180; // Latitude range

    const backgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0';
    const unvisitedColor = colorScheme === 'dark' ? '#333333' : '#e0e0e0';
    const visitedColorWithAlpha = visitedColor + '99'; // 60% opacity

    // Convert country coordinates to SVG polygons
    const polygons = useMemo(() => {
        const result: Array<{
            countryName: string;
            polygons: Array<{ points: string; isVisited: boolean }>;
        }> = [];

        Object.entries(countryCoordinates).forEach(([countryName, polyList]) => {
            const countryPolygons: Array<{ points: string; isVisited: boolean }> = [];
            const isVisited = visitedCountries.includes(countryName);

            polyList.forEach((coordinates) => {
                // Handle date line wrapping by splitting polygons
                let currentSegment: Array<[number, number]> = [];
                const segments: Array<Array<[number, number]>> = [];

                coordinates.forEach((coord, idx) => {
                    const x = (coord.longitude + 180) * scaleX;
                    const y = (90 - coord.latitude) * scaleY;

                    // Check if this coordinate is far from the previous one (date line crossing)
                    if (idx > 0 && currentSegment.length > 0) {
                        const prevCoord = coordinates[idx - 1];
                        const prevX = (prevCoord.longitude + 180) * scaleX;
                        // If distance is too large, it has crossed the date line
                        if (Math.abs(x - prevX) > mapWidth / 2) {
                            // Save current segment and start a new one
                            if (currentSegment.length >= 2) {
                                segments.push([...currentSegment]);
                            }
                            currentSegment = [];
                        }
                    }

                    currentSegment.push([x, y]);
                });

                // Add final segment
                if (currentSegment.length >= 2) {
                    segments.push(currentSegment);
                }

                // Convert segments to points strings
                segments.forEach((segment) => {
                    const points = segment
                        .map(([x, y]) => `${x},${y}`)
                        .join(' ');

                    if (points.trim()) {
                        countryPolygons.push({
                            points,
                            isVisited
                        });
                    }
                });
            });

            if (countryPolygons.length > 0) {
                result.push({
                    countryName,
                    polygons: countryPolygons
                });
            }
        });

        return result;
    }, [visitedCountries, scaleX, scaleY]);

    return (
        <View
            style={{
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Svg
                width={mapWidth}
                height={mapHeight}
                viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            >
                <Rect
                    x="0"
                    y="0"
                    width={mapWidth}
                    height={mapHeight}
                    fill={backgroundColor}
                />

                {polygons.map((country) =>
                    country.polygons.map((polygon, idx) => (
                        <Polygon
                            key={`${country.countryName}-${idx}`}
                            points={polygon.points}
                            fill={polygon.isVisited ? visitedColorWithAlpha : unvisitedColor}
                            stroke={
                                polygon.isVisited
                                    ? visitedColor
                                    : colorScheme === 'dark'
                                        ? '#444444'
                                        : '#d0d0d0'
                            }
                            strokeWidth="0.5"
                        />
                    ))
                )}
            </Svg>
        </View>
    );
};

export const SimpleWorldMap = memo(SimpleWorldMapComponent);
