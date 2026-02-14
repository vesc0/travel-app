import { countryCoordinates } from '@/constants/CountryCoordinates';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { memo, useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { ClipPath, Defs, G, Polygon, Rect } from 'react-native-svg';

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
                if (coordinates.length < 3) return;

                // Normalize longitudes to keep polygons continuous across the date line.
                // Instead of splitting, adjust longitudes so there are no >180° jumps,
                // then let SVG clipping handle any overflow beyond the map bounds.
                const normalizedLons: number[] = [coordinates[0].longitude];
                for (let i = 1; i < coordinates.length; i++) {
                    let lon = coordinates[i].longitude;
                    const prevLon = normalizedLons[i - 1];
                    while (lon - prevLon > 180) lon -= 360;
                    while (lon - prevLon < -180) lon += 360;
                    normalizedLons.push(lon);
                }

                const points = coordinates
                    .map((coord, i) => {
                        const x = (normalizedLons[i] + 180) * scaleX;
                        const y = (90 - coord.latitude) * scaleY;
                        return `${x},${y}`;
                    })
                    .join(' ');

                if (points.trim()) {
                    countryPolygons.push({ points, isVisited });
                }
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
                <Defs>
                    <ClipPath id="mapClip">
                        <Rect x="0" y="0" width={mapWidth} height={mapHeight} />
                    </ClipPath>
                </Defs>
                <Rect
                    x="0"
                    y="0"
                    width={mapWidth}
                    height={mapHeight}
                    fill={backgroundColor}
                />

                <G clipPath="url(#mapClip)">
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
                </G>
            </Svg>
        </View>
    );
};

export const SimpleWorldMap = memo(SimpleWorldMapComponent);
