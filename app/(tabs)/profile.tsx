import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDebounce } from '@/hooks/useDebounce';
import React, { useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ColorPicker from 'react-native-wheel-color-picker';

const isWeb = Platform.OS === 'web';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { visitedFillColor, setVisitedFillColor } = useCountries();
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const handleColorChange = useDebounce((color: string) => {
    setVisitedFillColor(color);
  }, 100);

  const topPadding = isWeb ? 32 : insets.top + 8;
  const bottomPadding = Platform.OS === 'ios' ? insets.bottom + 80 : 32;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: bottomPadding },
          isWeb && { maxWidth: 640, alignSelf: 'center', width: '100%' },
        ]}
      >
        <ThemedText type="title" style={styles.pageTitle}>Settings</ThemedText>

        <View style={[
          styles.section,
          isWeb && {
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            borderRadius: 12,
            // @ts-ignore
            boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)',
          },
        ]}>
          <ThemedText style={styles.sectionTitle}>Map Settings</ThemedText>

          <View style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Visited Countries Fill Color</ThemedText>
            <TouchableOpacity
              style={[
                styles.colorPreview,
                { backgroundColor: visitedFillColor },
                isWeb && styles.colorPreviewWeb,
              ]}
              onPress={() => setIsColorPickerVisible(true)}
            />
          </View>
        </View>

        <View style={[
          styles.section,
          isWeb && {
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            borderRadius: 12,
            // @ts-ignore
            boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)',
          },
        ]}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <View style={styles.settingItem}>
            <ThemedText style={styles.settingLabel}>Version</ThemedText>
            <ThemedText style={styles.settingValue}>1.0.0</ThemedText>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isColorPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsColorPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {
            backgroundColor: isDark ? '#333' : 'white',
          }]}>
            <ThemedText style={styles.modalTitle}>Choose Color</ThemedText>
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                color={visitedFillColor}
                onColorChange={handleColorChange}
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                row={false}
              />
            </View>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setIsColorPickerVisible(false)}
            >
              <ThemedText style={styles.doneButtonText}>Done</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 8,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.15)',
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
    marginRight: 16,
    flexShrink: 1,
  },
  settingValue: {
    color: '#666',
    fontSize: 15,
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: { elevation: 5 },
      web: { boxShadow: '0 2px 4px rgba(0,0,0,0.25)' } as any,
    }),
  },
  colorPreviewWeb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(150,150,150,0.3)',
    // @ts-ignore
    cursor: 'pointer',
    // @ts-ignore
    transition: 'transform 0.15s ease',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: { elevation: 5 },
      web: { boxShadow: '0 2px 4px rgba(0,0,0,0.25)' } as any,
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  colorPickerContainer: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 320,
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

