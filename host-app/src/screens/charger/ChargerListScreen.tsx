import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { RootState, AppDispatch } from '@/store';
import { fetchChargers, removeCharger, toggleStatus } from '@/store/slices/charger.slice';

export default function ChargerListScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { chargers } = useSelector((state: RootState) => state.charger);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // TODO: replace with real user name from auth/context
  const userName = 'Admin';

  useEffect(() => {
    dispatch(fetchChargers());
  }, [dispatch]);

  const handleAddCharger = () => {
    router.push('/add-charger');
  };

  const handleEdit = (id: string) => {
    router.push('/edit-charger');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Charger',
      'Are you sure you want to delete this charger?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(removeCharger(id)) },
      ]
    );
  };

  const handleToggleStatus = (id: string) => {
    dispatch(toggleStatus(id));
  };

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

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Top bar: Avatar, Greeting, and Notification */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={[styles.avatar, { backgroundColor: tintColor + '15' }]}>
            <ThemedText style={[styles.avatarText, { color: tintColor }]}>{userName[0]}</ThemedText>
          </TouchableOpacity>

          <View style={styles.greetingContainer}>
            <ThemedText style={[styles.greetingMain, { color: textColor }]}>
              Hello, {userName}
            </ThemedText>
            <ThemedText style={[styles.greetingSubtext, { color: textColor }]}>
              Manage Your Chargers
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity style={styles.notifyButton} accessibilityLabel="Notifications">
          <MaterialIcons name="notifications-none" size={26} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Add New Charger Button */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: tintColor }]} 
          onPress={handleAddCharger}
        >
          <MaterialIcons name="add-circle-outline" size={24} color="#fff" />
          <ThemedText style={styles.addButtonText}>Add New Charger</ThemedText>
        </TouchableOpacity>

        {/* Chargers Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Your Chargers ({chargers.length})
          </ThemedText>

          {chargers.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="ev-station" size={48} color={textColor} style={{ opacity: 0.3 }} />
              <ThemedText style={[styles.emptyText, { color: textColor }]}>
                No chargers yet
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: textColor }]}>
                Add your first charger to get started
              </ThemedText>
            </View>
          ) : (
            chargers.map((item: any) => (
              <View key={item.id} style={[styles.chargerCard, { backgroundColor: '#242424' }]}>
                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <MaterialIcons
                    name={item.status === 'AVAILABLE' ? 'check-circle' : 'info'}
                    size={16}
                    color={getStatusColor(item.status)}
                  />
                  <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {getStatusText(item.status)}
                  </ThemedText>
                </View>

                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <MaterialIcons name="ev-station" size={24} color={tintColor} />
                    <View style={styles.cardHeaderText}>
                      <ThemedText style={[styles.chargerName, { color: textColor }]}>
                        {item.name}
                      </ThemedText>
                      <ThemedText style={[styles.chargerLocation, { color: textColor }]}>
                        📍 {item.location}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                {/* Charger Details */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="bolt" size={16} color={textColor} style={{ opacity: 0.5 }} />
                    <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                      {item.type}
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="power" size={16} color={textColor} style={{ opacity: 0.5 }} />
                    <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                      {item.powerOutput} kW
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialIcons name="attach-money" size={16} color={textColor} style={{ opacity: 0.5 }} />
                    <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                      Rs. {item.pricePerKwh}/kWh
                    </ThemedText>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { borderColor: tintColor }]} 
                    onPress={() => handleEdit(item.id)}
                  >
                    <MaterialIcons name="edit" size={16} color={tintColor} />
                    <ThemedText style={[styles.actionButtonText, { color: tintColor }]}>
                      Edit
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, { borderColor: item.status === 'AVAILABLE' ? '#888' : tintColor }]} 
                    onPress={() => handleToggleStatus(item.id)}
                  >
                    <MaterialIcons 
                      name={item.status === 'AVAILABLE' ? 'pause-circle-outline' : 'play-circle-outline'} 
                      size={16} 
                      color={item.status === 'AVAILABLE' ? '#888' : tintColor} 
                    />
                    <ThemedText style={[styles.actionButtonText, { color: item.status === 'AVAILABLE' ? '#888' : tintColor }]}>
                      {item.status === 'AVAILABLE' ? 'Disable' : 'Enable'}
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, { borderColor: '#F44336' }]} 
                    onPress={() => handleDelete(item.id)}
                  >
                    <MaterialIcons name="delete-outline" size={16} color="#F44336" />
                    <ThemedText style={[styles.actionButtonText, { color: '#F44336' }]}>
                      Delete
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ThemedView>

        <View style={styles.spacer} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingMain: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  greetingSubtext: {
    fontSize: 15,
    opacity: 0.6,
    fontWeight: '400',
  },
  notifyButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 8,
  },
  chargerCard: {
    padding: 20,
    borderRadius: 20,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  chargerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  chargerLocation: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 13,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  spacer: {
    height: 100,
  },
});