import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCountries } from '@/contexts/CountryContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDebounce } from '@/hooks/useDebounce';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { visitedFillColor, setVisitedFillColor } = useCountries();
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  const handleColorChange = useDebounce((color: string) => {
    setVisitedFillColor(color);
  }, 100); // Debounce color updates to improve performance

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Map Settings</ThemedText>

          <View style={styles.settingItem}>
            <ThemedText>Visited Countries Fill Color</ThemedText>
            <TouchableOpacity
              style={[styles.colorPreview, { backgroundColor: visitedFillColor }]}
              onPress={() => setIsColorPickerVisible(true)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText>Version</ThemedText>
            <ThemedText style={styles.settingValue}>1.0.0</ThemedText>
          </TouchableOpacity>
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
            backgroundColor: colorScheme === 'dark' ? '#333' : 'white'
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
    paddingTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingValue: {
    color: '#666',
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  colorPickerContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

