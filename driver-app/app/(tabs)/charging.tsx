import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChargingCard, ChargingCardData } from '@/components/charging-card';

const dummyActiveSessions: ChargingCardData[] = [
  {
    id: '1',
    chargerName: 'Colombo City Center',
    vendor: 'ChargeMaster Pro',
    location: 'Colombo 03',
    status: 'active',
    kwhCharged: '12.5',
    fee: 'LKR 225',
    duration: '45 min',
    connectorType: 'Type 2',
  },
];

const dummyReservations: ChargingCardData[] = [
  {
    id: '2',
    chargerName: 'One Galle Face',
    vendor: 'EV Power Solutions',
    location: 'Colombo 02',
    status: 'reserved',
    fee: 'LKR 300',
    duration: '2 hours',
    connectorType: 'CCS2',
    reservationTime: 'Tomorrow 9:00 AM',
  },
  {
    id: '3',
    chargerName: 'Cinnamon Gardens',
    vendor: 'GreenCharge Lanka',
    location: 'Colombo 07',
    status: 'reserved',
    fee: 'LKR 225',
    duration: '1.5 hours',
    connectorType: 'Type 2',
    reservationTime: 'Tomorrow 2:00 PM',
  },
];

const dummyHistorySessions: ChargingCardData[] = [
  {
    id: '4',
    chargerName: 'Liberty Plaza',
    vendor: 'ChargeMaster Pro',
    location: 'Colombo 01',
    status: 'completed',
    kwhCharged: '8.2',
    fee: 'LKR 150',
    duration: '1 hour',
    startTime: 'Yesterday 3:00 PM',
    connectorType: 'Type 2',
  },
  {
    id: '5',
    chargerName: 'Dutch Hospital',
    vendor: 'EV Power Solutions',
    location: 'Colombo 01',
    status: 'completed',
    kwhCharged: '16.8',
    fee: 'LKR 300',
    duration: '2 hours',
    startTime: '2 days ago 10:00 AM',
    connectorType: 'CCS2',
  },
];

export default function ChargingScreen() {
  const [activeTab, setActiveTab] = useState<'active' | 'reservations' | 'history'>('active');

  const sessions = activeTab === 'active' ? dummyActiveSessions : activeTab === 'reservations' ? dummyReservations : dummyHistorySessions;

  return (
    <ThemedView style={styles.container}>
      {/* Tab Header */}
      <ThemedView style={styles.tabContainer}>
        <ThemedView
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onTouchEnd={() => setActiveTab('active')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={[styles.tab, activeTab === 'reservations' && styles.activeTab]}
          onTouchEnd={() => setActiveTab('reservations')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'reservations' && styles.activeTabText]}>
            Reservations
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onTouchEnd={() => setActiveTab('history')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Sessions List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sessions.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              {activeTab === 'active' ? 'No active charging sessions' : activeTab === 'reservations' ? 'No reservations' : 'No charging history'}
            </ThemedText>
          </ThemedView>
        ) : (
          sessions.map((session: ChargingCardData) => (
            <ChargingCard
              key={session.id}
              data={session}
              type={activeTab === 'active' ? 'active' : activeTab === 'reservations' ? 'reservation' : 'history'}
            />
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(240, 240, 240, 0.3)',
    borderRadius: 22,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 18,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#000000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
});