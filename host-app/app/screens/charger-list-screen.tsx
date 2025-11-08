import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';

export default function ChargerListScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'offline'>('all');

  // Mock data - will be fetched from API
  const chargers = [
    {
      id: 1,
      name: 'Mall Parking Charger',
      location: 'Colombo 03',
      status: 'Available',
      connectors: 2,
      revenue: '15,000 LKR',
      sessions: 45,
    },
    {
      id: 2,
      name: 'City Center Station',
      location: 'Colombo 02',
      status: 'Occupied',
      connectors: 2,
      revenue: '28,500 LKR',
      sessions: 68,
    },
    {
      id: 3,
      name: 'Office Complex',
      location: 'Colombo 07',
      status: 'Offline',
      connectors: 1,
      revenue: '0 LKR',
      sessions: 0,
    },
  ];

  const filteredChargers = chargers.filter((charger) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return charger.status !== 'Offline';
    if (activeTab === 'offline') return charger.status === 'Offline';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return '#10B981';
      case 'Occupied':
        return '#F59E0B';
      case 'Offline':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>My Chargers</ThemedText>
        <Pressable style={styles.addButton}>
          <IconSymbol name="plus" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <View style={styles.statCard}>
          <IconSymbol name="bolt.fill" size={24} color="#10B981" />
          <ThemedText style={styles.statValue}>{chargers.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Chargers</ThemedText>
        </View>
        <View style={styles.statCard}>
          <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color="#10B981" />
          <ThemedText style={styles.statValue}>
            {chargers.reduce((sum, c) => sum + c.sessions, 0)}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Sessions</ThemedText>
        </View>
        <View style={styles.statCard}>
          <IconSymbol name="dollarsign.circle.fill" size={24} color="#10B981" />
          <ThemedText style={styles.statValue}>
            {chargers.reduce((sum, c) => sum + parseInt(c.revenue.replace(/[^\d]/g, '')), 0).toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Revenue (LKR)</ThemedText>
        </View>
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All
          </ThemedText>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active
          </ThemedText>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'offline' && styles.activeTab]}
          onPress={() => setActiveTab('offline')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'offline' && styles.activeTabText]}>
            Offline
          </ThemedText>
        </Pressable>
      </View>

      {/* Charger List */}
      <ScrollView style={styles.chargerList} showsVerticalScrollIndicator={false}>
        {filteredChargers.map((charger) => (
          <Pressable key={charger.id} style={styles.chargerCard}>
            <View style={styles.chargerHeader}>
              <View style={styles.chargerInfo}>
                <ThemedText style={styles.chargerName}>{charger.name}</ThemedText>
                <View style={styles.locationRow}>
                  <IconSymbol name="location" size={14} color="#6B7280" />
                  <ThemedText style={styles.location}>{charger.location}</ThemedText>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(charger.status)}20` }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(charger.status) }]} />
                <ThemedText style={[styles.statusText, { color: getStatusColor(charger.status) }]}>
                  {charger.status}
                </ThemedText>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.chargerStats}>
              <View style={styles.chargerStat}>
                <IconSymbol name="cable.connector" size={16} color="#9CA3AF" />
                <ThemedText style={styles.chargerStatText}>{charger.connectors} Connectors</ThemedText>
              </View>
              <View style={styles.chargerStat}>
                <IconSymbol name="chart.bar.fill" size={16} color="#9CA3AF" />
                <ThemedText style={styles.chargerStatText}>{charger.sessions} Sessions</ThemedText>
              </View>
              <View style={styles.chargerStat}>
                <IconSymbol name="dollarsign.circle" size={16} color="#10B981" />
                <ThemedText style={[styles.chargerStatText, { color: '#10B981' }]}>
                  {charger.revenue}
                </ThemedText>
              </View>
            </View>

            <View style={styles.chargerActions}>
              <Pressable style={styles.actionButton}>
                <IconSymbol name="pencil" size={18} color="#10B981" />
                <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <IconSymbol name="chart.xyaxis.line" size={18} color="#10B981" />
                <ThemedText style={styles.actionButtonText}>Analytics</ThemedText>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <IconSymbol name="gearshape" size={18} color="#10B981" />
                <ThemedText style={styles.actionButtonText}>Settings</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: 150,
    padding: 16,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
  },
  activeTab: {
    backgroundColor: '#10B98120',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#10B981',
  },
  chargerList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chargerCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
  },
  chargerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  chargerInfo: {
    flex: 1,
  },
  chargerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
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
  separator: {
    height: 1,
    backgroundColor: '#262626',
    marginVertical: 12,
  },
  chargerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chargerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chargerStatText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  chargerActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#262626',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#10B98110',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  bottomSpacer: {
    height: 100,
  },
});
