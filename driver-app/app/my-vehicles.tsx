import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

export default function MyVehiclesScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();

  // TODO: Replace with real vehicle data from backend
  const vehicles = [
    {
      id: 1,
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      licensePlate: 'ABC-1234',
      color: 'Pearl White',
      socketType: 'Type 2',
      isPrimary: true,
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          My Vehicles
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Vehicles List */}
          {vehicles.map((vehicle) => (
            <View key={vehicle.id} style={[styles.vehicleCard, { backgroundColor: '#242424' }]}>
              {vehicle.isPrimary && (
                <View style={[styles.primaryBadge, { backgroundColor: tintColor }]}>
                  <ThemedText style={styles.primaryBadgeText}>Primary</ThemedText>
                </View>
              )}

              <View style={styles.vehicleHeader}>
                <View style={[styles.carIcon, { backgroundColor: tintColor + '15' }]}>
                  <MaterialIcons name="electric-car" size={32} color={tintColor} />
                </View>
                <View style={styles.vehicleTitle}>
                  <ThemedText style={[styles.vehicleName, { color: textColor }]}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </ThemedText>
                  <ThemedText style={[styles.licensePlate, { color: textColor }]}>
                    {vehicle.licensePlate}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.vehicleDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="palette" size={18} color={textColor} style={{ opacity: 0.6 }} />
                  <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                    Color:
                  </ThemedText>
                  <ThemedText style={[styles.detailValue, { color: textColor }]}>
                    {vehicle.color}
                  </ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="power" size={18} color={textColor} style={{ opacity: 0.6 }} />
                  <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                    Socket Type:
                  </ThemedText>
                  <ThemedText style={[styles.detailValue, { color: textColor }]}>
                    {vehicle.socketType}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.vehicleActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="edit" size={18} color={textColor} />
                  <ThemedText style={[styles.actionButtonText, { color: textColor }]}>
                    Edit
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="delete-outline" size={18} color="#F44336" />
                  <ThemedText style={[styles.actionButtonText, { color: '#F44336' }]}>
                    Remove
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add Vehicle Button */}
          <TouchableOpacity style={[styles.addButton, { backgroundColor: '#242424', borderColor: tintColor }]}>
            <MaterialIcons name="add-circle-outline" size={24} color={tintColor} />
            <ThemedText style={[styles.addButtonText, { color: tintColor }]}>
              Add New Vehicle
            </ThemedText>
          </TouchableOpacity>

          {/* Info Card */}
          <View style={[styles.infoCard, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
            <MaterialIcons name="info-outline" size={20} color={tintColor} />
            <ThemedText style={[styles.infoText, { color: textColor }]}>
              Adding your vehicle helps us recommend compatible charging stations and provide accurate charging estimates.
            </ThemedText>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </ThemedView>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  vehicleCard: {
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
  primaryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  carIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  vehicleTitle: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 14,
    opacity: 0.7,
  },
  vehicleDetails: {
    marginBottom: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
    opacity: 0.8,
  },
  spacer: {
    height: 40,
  },
});
