import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
  const router = useRouter();

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
    // Navigate to charging session screen
    router.push({
      pathname: '/charging-session',
      params: { charger: JSON.stringify(charger) }
    });
  };

  const handleReserve = () => {
    // TODO: Implement reservation logic
    console.log('Reserve charger:', charger.name);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>
            Charger Details
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.content}>
            {/* Charger Name */}
            <ThemedText style={[styles.chargerName, { color: textColor }]}>
              {charger.name}
            </ThemedText>

            {/* Location */}
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={16} color={textColor} style={{ opacity: 0.6 }} />
              <ThemedText style={[styles.address, { color: textColor }]}>{charger.address}</ThemedText>
            </View>

            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(charger.status) + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(charger.status) }]} />
              <ThemedText style={[styles.statusText, { color: getStatusColor(charger.status) }]}>
                {getStatusText(charger.status)}
              </ThemedText>
            </View>

            {/* Details Grid */}
            <View style={[styles.detailsCard, { backgroundColor: '#242424' }]}>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <ThemedText style={[styles.detailLabel, { color: textColor }]}>Type</ThemedText>
                  <ThemedText style={[styles.detailValue, { color: textColor }]}>
                    {charger.type.replace('_', ' ')}
                  </ThemedText>
                </View>

                <View style={styles.detailItem}>
                  <ThemedText style={[styles.detailLabel, { color: textColor }]}>Power</ThemedText>
                  <ThemedText style={[styles.detailValue, { color: textColor }]}>
                    {charger.powerOutput} kW
                  </ThemedText>
                </View>

                <View style={styles.detailItem}>
                  <ThemedText style={[styles.detailLabel, { color: textColor }]}>Connector</ThemedText>
                  <ThemedText style={[styles.detailValue, { color: textColor }]}>
                    {charger.connectorType}
                  </ThemedText>
                </View>

                <View style={styles.detailItem}>
                  <ThemedText style={[styles.detailLabel, { color: textColor }]}>Price</ThemedText>
                  <ThemedText style={[styles.detailValue, { color: tintColor }]}>
                    Rs. {charger.pricePerKwh}/kWh
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Provider Info */}
            {charger.vendor && (
              <View style={[styles.infoCard, { backgroundColor: '#242424' }]}>
                <ThemedText style={[styles.infoLabel, { color: textColor }]}>Provider</ThemedText>
                <ThemedText style={[styles.infoValue, { color: textColor }]}>
                  {charger.vendor}
                </ThemedText>
              </View>
            )}

            {/* Description */}
            {charger.description && (
              <View style={[styles.infoCard, { backgroundColor: '#242424' }]}>
                <ThemedText style={[styles.infoLabel, { color: textColor }]}>About</ThemedText>
                <ThemedText style={[styles.description, { color: textColor }]}>
                  {charger.description}
                </ThemedText>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40, // Offset the back button width
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for fixed buttons
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  chargerName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 34,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  address: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  detailsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  detailItem: {
    width: '45%',
  },
  detailLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 6,
    lineHeight: 18,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  infoLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
    lineHeight: 18,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
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