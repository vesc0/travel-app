import React, { createContext, ReactNode, useContext, useState } from 'react';

type CountryContextType = {
    selected: string[];
    toggleCountry: (name: string) => void;
};

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleCountry = (name: string) => {
        setSelected((prev) =>
            prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
        );
    };

    return (
        <CountryContext.Provider value={{ selected, toggleCountry }}>
            {children}
        </CountryContext.Provider>
    );
}

export function useCountries() {
    const ctx = useContext(CountryContext);
    if (!ctx) throw new Error('useCountries must be used inside CountryProvider');
    return ctx;
}
