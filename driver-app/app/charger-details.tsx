import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DummyCharger } from '@/data/dummy-chargers';

export default function ChargerDetailsScreen() {
  const params = useLocalSearchParams();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Parse the charger data from params
  const charger: DummyCharger = JSON.parse(params.charger as string);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return '#10B981';
      case 'OCCUPIED': return '#F59E0B';
      case 'OFFLINE': return '#6B7280';
      case 'MAINTENANCE': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Available';
      case 'OCCUPIED': return 'In Use';
      case 'OFFLINE': return 'Offline';
      case 'MAINTENANCE': return 'Maintenance';
      default: return status;
    }
  };

  const handleStartCharging = () => {
    // TODO: Implement charging logic
    console.log('Start charging at:', charger.name);
  };

  const handleReserve = () => {
    // TODO: Implement reservation logic
    console.log('Reserve charger:', charger.name);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: charger.name,
          headerStyle: { backgroundColor },
          headerTintColor: textColor,
        }}
      />
      <View style={[styles.container, { backgroundColor }]}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.content}>
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(charger.status) + '20' }]}>
              <MaterialIcons
                name={charger.status === 'AVAILABLE' ? 'check-circle' : 'info'}
                size={16}
                color={getStatusColor(charger.status)}
              />
              <ThemedText style={[styles.statusText, { color: getStatusColor(charger.status) }]}>
                {getStatusText(charger.status)}
              </ThemedText>
            </View>

            {/* Address */}
            <View style={styles.section}>
              <MaterialIcons name="location-on" size={20} color={textColor} />
              <ThemedText style={styles.address}>{charger.address}</ThemedText>
            </View>

            {/* Charging Details */}
            <View style={styles.detailsCard}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Charging Details</ThemedText>

              <View style={styles.detailRow}>
                <MaterialIcons name="bolt" size={18} color={textColor} />
                <ThemedText style={styles.detailLabel}>Type:</ThemedText>
                <ThemedText style={styles.detailValue}>{charger.type.replace('_', ' ')}</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons name="power" size={18} color={textColor} />
                <ThemedText style={styles.detailLabel}>Power:</ThemedText>
                <ThemedText style={styles.detailValue}>{charger.powerOutput} kW</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons name="speed" size={18} color={textColor} />
                <ThemedText style={styles.detailLabel}>Speed:</ThemedText>
                <ThemedText style={styles.detailValue}>{charger.chargingSpeed}</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <MaterialIcons name="attach-money" size={18} color={textColor} />
                <ThemedText style={styles.detailLabel}>Price:</ThemedText>
                <ThemedText style={styles.detailValue}>Rs. {charger.pricePerHour}/hour</ThemedText>
              </View>
            </View>

            {/* Connector Type */}
            <View style={styles.detailsCard}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Connector</ThemedText>
              <View style={styles.detailRow}>
                <MaterialIcons name="cable" size={18} color={textColor} />
                <ThemedText style={styles.detailValue}>{charger.connectorType}</ThemedText>
              </View>
            </View>

            {/* Vendor */}
            {charger.vendor && (
              <View style={styles.detailsCard}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Provider</ThemedText>
                <View style={styles.detailRow}>
                  <MaterialIcons name="business" size={18} color={textColor} />
                  <ThemedText style={styles.detailValue}>{charger.vendor}</ThemedText>
                </View>
              </View>
            )}

            {/* Description */}
            {charger.description && (
              <View style={styles.detailsCard}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Description</ThemedText>
                <ThemedText style={styles.description}>{charger.description}</ThemedText>
              </View>
            )}

            {/* Spacer for fixed buttons */}
            <View style={styles.buttonSpacer} />
          </ThemedView>
        </ScrollView>

        {/* Fixed Action Buttons */}
        <View style={[styles.fixedButtonContainer, { backgroundColor }]}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: 'rgba(255, 255, 255, 0.3)' }]}
              onPress={handleReserve}
            >
              <MaterialIcons name="schedule" size={20} color="white" />
              <ThemedText style={[styles.secondaryButtonText, { color: 'white' }]}>
                Reserve
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: tintColor }]}
              onPress={handleStartCharging}
              disabled={charger.status !== 'AVAILABLE'}
            >
              <MaterialIcons name="bolt" size={22} color="white" />
              <ThemedText style={styles.primaryButtonText}>
                Start Charging
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for fixed buttons
  },
  content: {
    padding: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  address: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    marginLeft: 8,
    minWidth: 60,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  buttonSpacer: {
    height: 20,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40, // Extra padding for safe area
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonGroup: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '400',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});