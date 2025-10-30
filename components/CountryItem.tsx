import { MaterialIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';

interface CountryItemProps {
    name: string;
    isSelected: boolean;
    onToggle: (name: string) => void;
    textColor: string;
}

const CountryItem = memo(({ name, isSelected, onToggle, textColor }: CountryItemProps) => {
    const handlePress = () => onToggle(name);

    return (
        <TouchableOpacity
            style={styles.countryItem}
            onPress={handlePress}
        >
            <ThemedText style={[styles.countryName, { color: textColor }]}>
                {name}
            </ThemedText>
            {isSelected && (
                <MaterialIcons name="check" size={24} color="#00bfa5" />
            )}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    countryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(150, 150, 150, 0.2)',
    },
    countryName: {
        fontSize: 16,
    },
});

export default CountryItem;