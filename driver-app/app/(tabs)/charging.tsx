import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type ChargingSession = {
  id: string;
  stationName: string;
  location: string;
  status: 'active' | 'completed' | 'reserved';
  startTime: string;
  duration: string;
  cost: string;
  connectorType: string;
};

const dummyActiveSessions: ChargingSession[] = [
  {
    id: '1',
    stationName: 'Colombo City Center',
    location: 'Colombo 03',
    status: 'active',
    startTime: '2:30 PM',
    duration: '45 min',
    cost: 'LKR 225',
    connectorType: 'Type 2',
  },
];

const dummyReservations: ChargingSession[] = [
  {
    id: '2',
    stationName: 'One Galle Face',
    location: 'Colombo 02',
    status: 'reserved',
    startTime: 'Tomorrow 9:00 AM',
    duration: '2 hours',
    cost: 'LKR 300',
    connectorType: 'CCS2',
  },
  {
    id: '3',
    stationName: 'Cinnamon Gardens',
    location: 'Colombo 07',
    status: 'reserved',
    startTime: 'Tomorrow 2:00 PM',
    duration: '1.5 hours',
    cost: 'LKR 225',
    connectorType: 'Type 2',
  },
];

const dummyHistorySessions: ChargingSession[] = [
  {
    id: '4',
    stationName: 'Liberty Plaza',
    location: 'Colombo 01',
    status: 'completed',
    startTime: 'Yesterday 3:00 PM',
    duration: '1 hour',
    cost: 'LKR 150',
    connectorType: 'Type 2',
  },
  {
    id: '5',
    stationName: 'Dutch Hospital',
    location: 'Colombo 01',
    status: 'completed',
    startTime: '2 days ago 10:00 AM',
    duration: '2 hours',
    cost: 'LKR 300',
    connectorType: 'CCS2',
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active':
      return styles.active;
    case 'completed':
      return styles.completed;
    case 'reserved':
      return styles.reserved;
    default:
      return styles.completed;
  }
};

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
          sessions.map((session: ChargingSession) => (
            <ThemedView key={session.id} style={styles.card}>
              <ThemedView style={styles.cardHeader}>
                <ThemedText style={styles.stationName}>{session.stationName}</ThemedText>
                <ThemedView style={[styles.statusBadge, getStatusStyle(session.status)]}>
                  <ThemedText style={styles.statusText}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedText style={styles.location}>{session.location}</ThemedText>

              <ThemedView style={styles.detailsRow}>
                <ThemedView style={styles.detail}>
                  <ThemedText style={styles.detailLabel}>Started</ThemedText>
                  <ThemedText style={styles.detailValue}>{session.startTime}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.detail}>
                  <ThemedText style={styles.detailLabel}>Duration</ThemedText>
                  <ThemedText style={styles.detailValue}>{session.duration}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.detail}>
                  <ThemedText style={styles.detailLabel}>Cost</ThemedText>
                  <ThemedText style={styles.detailValue}>{session.cost}</ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.connectorRow}>
                <ThemedText style={styles.connectorType}>{session.connectorType}</ThemedText>
              </ThemedView>
            </ThemedView>
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
  card: {
    backgroundColor: '#242424',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  active: {
    backgroundColor: '#00BC74',
  },
  completed: {
    backgroundColor: '#666666',
  },
  reserved: {
    backgroundColor: '#FFA500',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  location: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detail: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  connectorRow: {
    alignItems: 'flex-end',
  },
  connectorType: {
    fontSize: 12,
    opacity: 0.7,
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});