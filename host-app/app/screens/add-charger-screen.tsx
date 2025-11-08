import { StyleSheet, View, TextInput, ScrollView, Pressable, Switch } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';

export default function AddChargerScreen() {
  const [formData, setFormData] = useState({
    name: '',
    ocppChargePointId: '',
    address: '',
    pricePerHour: '',
    powerKw: '',
    connectorType: 'Type 2',
    amenities: [] as string[],
    is24Hours: true,
  });

  const availableAmenities = ['WiFi', 'Cafe', 'Parking', 'Restroom', 'Waiting Area', 'Vending Machine'];
  const connectorTypes = ['Type 2', 'CCS2', 'CHAdeMO', 'Type 1'];

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = () => {
    // TODO: Call API to create charger
    console.log('Create charger:', formData);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Add Charger</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Basic Information</ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Charger Name *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mall Parking Charger"
              placeholderTextColor="#6B7280"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>OCPP Charge Point ID *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g., CP_001_MALL"
              placeholderTextColor="#6B7280"
              value={formData.ocppChargePointId}
              onChangeText={(text) => setFormData({ ...formData, ocppChargePointId: text })}
            />
            <ThemedText style={styles.hint}>Unique identifier for OCPP connection</ThemedText>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Location Address *</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter full address"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>

          <Pressable style={styles.locationButton}>
            <IconSymbol name="location.fill" size={20} color="#10B981" />
            <ThemedText style={styles.locationButtonText}>Set Location on Map</ThemedText>
          </Pressable>
        </View>

        {/* Charging Specifications */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Charging Specifications</ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Connector Type *</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.connectorTypes}>
              {connectorTypes.map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.connectorTypeButton,
                    formData.connectorType === type && styles.connectorTypeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, connectorType: type })}
                >
                  <ThemedText
                    style={[
                      styles.connectorTypeText,
                      formData.connectorType === type && styles.connectorTypeTextActive,
                    ]}
                  >
                    {type}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <ThemedText style={styles.label}>Power (kW) *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="7.2"
                placeholderTextColor="#6B7280"
                keyboardType="decimal-pad"
                value={formData.powerKw}
                onChangeText={(text) => setFormData({ ...formData, powerKw: text })}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <ThemedText style={styles.label}>Price per Hour (LKR) *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="150"
                placeholderTextColor="#6B7280"
                keyboardType="decimal-pad"
                value={formData.pricePerHour}
                onChangeText={(text) => setFormData({ ...formData, pricePerHour: text })}
              />
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Amenities</ThemedText>
          <View style={styles.amenitiesContainer}>
            {availableAmenities.map((amenity) => (
              <Pressable
                key={amenity}
                style={[
                  styles.amenityButton,
                  formData.amenities.includes(amenity) && styles.amenityButtonActive,
                ]}
                onPress={() => toggleAmenity(amenity)}
              >
                <IconSymbol
                  name={formData.amenities.includes(amenity) ? 'checkmark.circle.fill' : 'circle'}
                  size={20}
                  color={formData.amenities.includes(amenity) ? '#10B981' : '#6B7280'}
                />
                <ThemedText
                  style={[
                    styles.amenityText,
                    formData.amenities.includes(amenity) && styles.amenityTextActive,
                  ]}
                >
                  {amenity}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Operating Hours */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Operating Hours</ThemedText>
          <View style={styles.switchRow}>
            <ThemedText style={styles.switchLabel}>24/7 Operation</ThemedText>
            <Switch
              value={formData.is24Hours}
              onValueChange={(value) => setFormData({ ...formData, is24Hours: value })}
              trackColor={{ false: '#262626', true: '#10B98140' }}
              thumbColor={formData.is24Hours ? '#10B981' : '#6B7280'}
            />
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.cancelButton}>
          <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
        </Pressable>
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <ThemedText style={styles.submitButtonText}>Create Charger</ThemedText>
          <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B98120',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  locationButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10B981',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  connectorTypes: {
    flexDirection: 'row',
  },
  connectorTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
    marginRight: 10,
  },
  connectorTypeButtonActive: {
    backgroundColor: '#10B98120',
    borderColor: '#10B981',
  },
  connectorTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  connectorTypeTextActive: {
    color: '#10B981',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
  },
  amenityButtonActive: {
    backgroundColor: '#10B98120',
    borderColor: '#10B981',
  },
  amenityText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  amenityTextActive: {
    color: '#10B981',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
  },
  switchLabel: {
    fontSize: 15,
    color: '#E5E7EB',
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderColor: '#262626',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
