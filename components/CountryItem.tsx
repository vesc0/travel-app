import { getCountryFlag } from '@/utils/flagUtils';
import { MaterialIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

const isWeb = Platform.OS === 'web';

interface CountryItemProps {
    name: string;
    isSelected: boolean;
    onToggle: (name: string) => void;
    textColor: string;
}

const CountryItem = memo(({ name, isSelected, onToggle, textColor }: CountryItemProps) => {
    const handlePress = () => onToggle(name);
    const flag = getCountryFlag(name);

    return (
        <TouchableOpacity
            style={[
                styles.countryItem,
                isWeb && styles.countryItemWeb,
                isSelected && styles.countryItemSelected,
            ]}
            onPress={handlePress}
        >
            <View style={styles.leftContent}>
                <Text style={styles.flag}>{flag}</Text>
                <ThemedText style={[styles.countryName, { color: textColor }]}>
                    {name}
                </ThemedText>
            </View>
            {isSelected ? (
                <MaterialIcons name="check-circle" size={24} color="#00bfa5" />
            ) : (
                <MaterialIcons name="add-circle-outline" size={24} color="#999" />
            )}
        </TouchableOpacity>
    );
});

CountryItem.displayName = 'CountryItem';

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
    countryItemWeb: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 8,
        marginHorizontal: 8,
        marginVertical: 1,
        borderBottomWidth: 0,
        // @ts-ignore
        cursor: 'pointer',
        // @ts-ignore
        transition: 'background-color 0.12s ease',
    },
    countryItemSelected: {
        backgroundColor: 'rgba(0, 191, 165, 0.08)',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    flag: {
        fontSize: 24,
        marginRight: 12,
    },
    countryName: {
        fontSize: 16,
    },
});

export default CountryItem;