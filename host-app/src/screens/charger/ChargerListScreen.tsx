import React, { useEffect, useState } from 'react';
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

  const [activeTab, setActiveTab] = useState<'chargers' | 'reservations' | 'requests'>('chargers');

  // TODO: Replace with real reservations from backend
  const pendingReservations = [
    {
      id: '1',
      userName: 'Kasun Perera',
      chargerName: 'Colombo Station - Connector 1',
      requestedTime: '2:30 PM - 4:00 PM',
      vehicleType: 'Tesla Model 3',
      estimatedDuration: '1.5 hrs',
    },
    {
      id: '2',
      userName: 'Nimal Silva',
      chargerName: 'Kandy Road Station - Connector 1',
      requestedTime: '3:00 PM - 5:00 PM',
      vehicleType: 'Nissan Leaf',
      estimatedDuration: '2 hrs',
    },
    {
      id: '3',
      userName: 'Amara Fernando',
      chargerName: 'Colombo Station - Connector 1',
      requestedTime: '4:15 PM - 6:00 PM',
      vehicleType: 'BMW i3',
      estimatedDuration: '1.75 hrs',
    },
  ];

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
      {/* Title and Add Button Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.pageTitle, { color: textColor }]}>
          Chargers
        </ThemedText>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: tintColor }]} 
          onPress={handleAddCharger}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'chargers' && styles.activeTab,
            activeTab === 'chargers' && { borderBottomColor: tintColor }
          ]}
          onPress={() => setActiveTab('chargers')}
        >
          <ThemedText 
            style={[
              styles.tabText,
              { color: textColor },
              activeTab === 'chargers' && styles.activeTabText,
              activeTab === 'chargers' && { color: tintColor }
            ]}
          >
            Chargers
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'reservations' && styles.activeTab,
            activeTab === 'reservations' && { borderBottomColor: tintColor }
          ]}
          onPress={() => setActiveTab('reservations')}
        >
          <ThemedText 
            style={[
              styles.tabText,
              { color: textColor },
              activeTab === 'reservations' && styles.activeTabText,
              activeTab === 'reservations' && { color: tintColor }
            ]}
          >
            Reservations
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'requests' && styles.activeTab,
            activeTab === 'requests' && { borderBottomColor: tintColor }
          ]}
          onPress={() => setActiveTab('requests')}
        >
          <ThemedText 
            style={[
              styles.tabText,
              { color: textColor },
              activeTab === 'requests' && styles.activeTabText,
              activeTab === 'requests' && { color: tintColor }
            ]}
          >
            Requests
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Chargers Section */}
        {activeTab === 'chargers' && (
          <ThemedView style={styles.section}>
            {chargers.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: '#242424' }]}>
                <MaterialIcons name="ev-station" size={48} color={textColor} style={{ opacity: 0.3 }} />
                <ThemedText style={[styles.emptyText, { color: textColor }]}>
                  No chargers added yet
                </ThemedText>
                <ThemedText style={[styles.emptySubtext, { color: textColor }]}>
                  Add your first charging station to start earning
                </ThemedText>
              </View>
            ) : (
              chargers.map((item: any) => (
                <View key={item.id} style={[styles.chargerCard, { backgroundColor: '#242424' }]}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[styles.chargerIcon, { backgroundColor: tintColor + '20' }]}>
                        <MaterialIcons name="ev-station" size={20} color={tintColor} />
                      </View>
                      <View style={styles.cardHeaderText}>
                        <ThemedText style={[styles.chargerName, { color: textColor }]}>
                          {item.name}
                        </ThemedText>
                        <ThemedText style={[styles.chargerLocation, { color: textColor }]}>
                          {item.location}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                      <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusText(item.status)}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Charger Details Grid */}
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                          Type
                        </ThemedText>
                        <ThemedText style={[styles.detailValue, { color: textColor }]}>
                          {item.type}
                        </ThemedText>
                      </View>
                      <View style={styles.detailItem}>
                        <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                          Power
                        </ThemedText>
                        <ThemedText style={[styles.detailValue, { color: textColor }]}>
                          {item.powerOutput} kW
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                          Rate
                        </ThemedText>
                        <ThemedText style={[styles.detailValue, { color: tintColor }]}>
                          Rs. {item.pricePerKwh}/kWh
                        </ThemedText>
                      </View>
                      <View style={styles.detailItem}>
                        <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                          Sessions Today
                        </ThemedText>
                        <ThemedText style={[styles.detailValue, { color: textColor }]}>
                          {Math.floor(Math.random() * 8) + 1}
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.secondaryAction]} 
                      onPress={() => handleEdit(item.id)}
                    >
                      <MaterialIcons name="edit" size={18} color={textColor} />
                      <ThemedText style={[styles.actionButtonText, { color: textColor }]}>
                        Edit
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        styles.actionButton, 
                        item.status === 'AVAILABLE' ? styles.secondaryAction : styles.primaryAction,
                        item.status !== 'AVAILABLE' && { backgroundColor: tintColor }
                      ]} 
                      onPress={() => handleToggleStatus(item.id)}
                    >
                      <MaterialIcons 
                        name={item.status === 'AVAILABLE' ? 'power-off' : 'power'} 
                        size={18} 
                        color={item.status === 'AVAILABLE' ? textColor : '#fff'} 
                      />
                      <ThemedText style={[
                        styles.actionButtonText, 
                        { color: item.status === 'AVAILABLE' ? textColor : '#fff' }
                      ]}>
                        {item.status === 'AVAILABLE' ? 'Disable' : 'Enable'}
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, styles.dangerAction]} 
                      onPress={() => handleDelete(item.id)}
                    >
                      <MaterialIcons name="delete-outline" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ThemedView>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <ThemedView style={styles.section}>
            <View style={[styles.emptyCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="event" size={48} color={textColor} style={{ opacity: 0.3 }} />
              <ThemedText style={[styles.emptyText, { color: textColor }]}>
                No reservations
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: textColor }]}>
                Upcoming reservations will appear here
              </ThemedText>
            </View>
          </ThemedView>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <ThemedView style={styles.section}>
            {pendingReservations.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: '#242424' }]}>
                <MaterialIcons name="notifications-none" size={48} color={textColor} style={{ opacity: 0.3 }} />
                <ThemedText style={[styles.emptyText, { color: textColor }]}>
                  No pending requests
                </ThemedText>
                <ThemedText style={[styles.emptySubtext, { color: textColor }]}>
                  New reservation requests will appear here
                </ThemedText>
              </View>
            ) : (
              pendingReservations.map((reservation) => (
                <TouchableOpacity 
                  key={reservation.id} 
                  style={[styles.reservationCard, { backgroundColor: '#242424' }]}
                  onPress={() => router.push(`/reservation-details?id=${reservation.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.reservationContent}>
                    <View style={styles.reservationLeft}>
                      <View style={[styles.userAvatar, { backgroundColor: tintColor + '20' }]}>
                        <ThemedText style={[styles.userAvatarText, { color: tintColor }]}>
                          {reservation.userName[0]}
                        </ThemedText>
                      </View>
                      <View style={styles.reservationInfo}>
                        <ThemedText style={[styles.userName, { color: textColor }]}>
                          {reservation.userName}
                        </ThemedText>
                        <ThemedText style={[styles.reservationTime, { color: textColor }]}>
                          {reservation.requestedTime}
                        </ThemedText>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={textColor} style={{ opacity: 0.3 }} />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ThemedView>
        )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00BC74',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.6,
  },
  activeTabText: {
    fontWeight: '700',
    opacity: 1,
  },
  section: {
    marginHorizontal: 20,
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
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 8,
    textAlign: 'center',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chargerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  chargerName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  chargerLocation: {
    fontSize: 14,
    opacity: 0.6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    gap: 12,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: 6,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    flex: 1,
  },
  secondaryAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  primaryAction: {
    shadowColor: '#00BC74',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dangerAction: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    flex: 0,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reservationCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  reservationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reservationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  reservationInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reservationTime: {
    fontSize: 13,
    opacity: 0.6,
  },
  spacer: {
    height: 100,
  },
});