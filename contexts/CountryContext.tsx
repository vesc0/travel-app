import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type CountryContextType = {
    selected: string[];
    toggleCountry: (name: string) => void;
    visitedFillColor: string;
    setVisitedFillColor: (color: string) => void;
    visitedFillColorWithAlpha: string;
};

const CountryContext = createContext<CountryContextType | undefined>(undefined);

const SELECTED_COUNTRIES_KEY = 'selectedCountries';
const VISITED_COLOR_KEY = 'visitedFillColor';

export function CountryProvider({ children }: { children: ReactNode }) {
    const [selected, setSelected] = useState<string[]>([]);
    const [visitedFillColor, setVisitedFillColor] = useState('#00bfa5');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data from storage on app start
    useEffect(() => {
        const loadData = async () => {
            try {
                const [countriesData, colorData] = await Promise.all([
                    AsyncStorage.getItem(SELECTED_COUNTRIES_KEY),
                    AsyncStorage.getItem(VISITED_COLOR_KEY),
                ]);

                if (countriesData) {
                    setSelected(JSON.parse(countriesData));
                }
                if (colorData) {
                    setVisitedFillColor(colorData);
                }
            } catch (error) {
                console.error('Failed to load data from storage:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadData();
    }, []);

    // Save selected countries whenever they change
    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem(SELECTED_COUNTRIES_KEY, JSON.stringify(selected)).catch(error => {
                console.error('Failed to save countries:', error);
            });
        }
    }, [selected, isLoaded]);

    // Save visited fill color whenever it changes
    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem(VISITED_COLOR_KEY, visitedFillColor).catch(error => {
                console.error('Failed to save color:', error);
            });
        }
    }, [visitedFillColor, isLoaded]);

    // Memoize the color with alpha to prevent unnecessary recalculations
    const visitedFillColorWithAlpha = useMemo(() => {
        return visitedFillColor + '4D'; // 30% opacity
    }, [visitedFillColor]);

    const toggleCountry = (name: string) => {
        setSelected((prev) =>
            prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
        );
    };

    return (
        <CountryContext.Provider value={{
            selected,
            toggleCountry,
            visitedFillColor,
            setVisitedFillColor,
            visitedFillColorWithAlpha
        }}>
            {children}
        </CountryContext.Provider>
    );
}

export function useCountries() {
    const ctx = useContext(CountryContext);
    if (!ctx) throw new Error('useCountries must be used inside CountryProvider');
    return ctx;
}
