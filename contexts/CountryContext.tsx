import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type CountryContextType = {
    selected: string[];
    toggleCountry: (name: string) => void;
    visitedFillColor: string;
    setVisitedFillColor: (color: string) => void;
    visitedFillColorWithAlpha: string;
};

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
    const [selected, setSelected] = useState<string[]>([]);
    const [visitedFillColor, setVisitedFillColor] = useState('#00bfa5');

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
