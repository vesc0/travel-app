import NativeMapView from '@/components/NativeMapView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useCountries } from '@/contexts/CountryContext';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, useWindowDimensions, View } from 'react-native';

class MapErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: string | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error: error.message };
    }
    render() {
        if (this.state.hasError) {
            return (
                <View style={errorStyles.container}>
                    <MaterialIcons name="map" size={48} color="#999" />
                    <Text style={errorStyles.title}>Map cannot be loaded</Text>
                    <Text style={errorStyles.message}>{this.state.error ?? 'Unknown error'}</Text>
                </View>
            );
        }
        return this.props.children;
    }
}

const errorStyles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#555' },
    message: { fontSize: 13, color: '#999', textAlign: 'center' },
});

export default function MapScreen() {
    const { selected, visitedFillColor, visitedFillColorWithAlpha } = useCountries();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = Colors[colorScheme ?? 'light'];
    const { width, height } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';

    const handleAddCountries = () => {
        router.push('/modal');
    };

    // On web, use a View with backgroundColor instead of BlurView for better compatibility
    const AddButton = isWeb ? (
        <View
            style={[
                styles.addButton,
                {
                    backgroundColor: isDark ? 'rgba(40,40,40,0.9)' : 'rgba(0,0,0,0.6)',
                    // @ts-ignore – web-only CSS property
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                },
            ]}
        >
            <TouchableOpacity style={styles.buttonContent} onPress={handleAddCountries}>
                <MaterialIcons name="add" size={22} color="#fff" />
                <ThemedText style={styles.buttonText}>Add Countries</ThemedText>
            </TouchableOpacity>
        </View>
    ) : (
        <BlurView
            intensity={50}
            tint={isDark ? 'dark' : 'light'}
            style={styles.addButton}
        >
            <TouchableOpacity style={styles.buttonContent} onPress={handleAddCountries}>
                <MaterialIcons name="add" size={24} color="#fff" />
                <ThemedText style={styles.buttonText}>Add Countries</ThemedText>
            </TouchableOpacity>
        </BlurView>
    );

    return (
        <MapErrorBoundary>
            <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
                {AddButton}
                <NativeMapView
                    selected={selected}
                    visitedFillColor={visitedFillColor}
                    visitedFillColorWithAlpha={visitedFillColorWithAlpha}
                    width={width}
                    height={height}
                />
            </ThemedView>
        </MapErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addButton: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 16 : 60,
        right: 16,
        borderRadius: 24,
        overflow: 'hidden',
        zIndex: 10,
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
            web: { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } as any,
        }),
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 15,
    },
});
