import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';

export default function HomeScreen() {
  // Mock user data
  const user = {
    name: 'John Doe',
    vehicleModel: 'Tesla Model 3',
    batteryLevel: 68,
    chargingSessions: 45,
    totalKwh: 523.4,
  };

  // Mock nearby chargers
  const nearbyChargers = [
    { id: 1, name: 'Mall Parking', distance: '0.5 km', status: 'Available' },
    { id: 2, name: 'City Center', distance: '1.2 km', status: 'Available' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
            <ThemedText style={styles.userName}>{user.name}</ThemedText>
          </View>
          <Pressable style={styles.notificationButton}>
            <IconSymbol name="bell.fill" size={24} color="#10B981" />
          </Pressable>
        </View>

        {/* Vehicle Status Card */}
        <View style={styles.vehicleCard}>
          <View style={styles.vehicleHeader}>
            <View>
              <ThemedText style={styles.vehicleModel}>{user.vehicleModel}</ThemedText>
              <ThemedText style={styles.vehicleLabel}>Current Vehicle</ThemedText>
            </View>
            <IconSymbol name="car.fill" size={48} color="#10B981" />
          </View>

          {/* Battery Level */}
          <View style={styles.batterySection}>
            <View style={styles.batteryInfo}>
              <ThemedText style={styles.batteryLabel}>Battery Level</ThemedText>
              <ThemedText style={styles.batteryValue}>{user.batteryLevel}%</ThemedText>
            </View>
            <View style={styles.batteryBarContainer}>
              <View
                style={[
                  styles.batteryBarFill,
                  {
                    width: `${user.batteryLevel}%`,
                    backgroundColor:
                      user.batteryLevel > 50 ? '#10B981' : user.batteryLevel > 20 ? '#F59E0B' : '#EF4444',
                  },
                ]}
              />
            </View>
            <ThemedText style={styles.rangeText}>~{Math.round(user.batteryLevel * 4.5)} km range</ThemedText>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <IconSymbol name="bolt.fill" size={20} color="#10B981" />
              <ThemedText style={styles.statValue}>{user.chargingSessions}</ThemedText>
              <ThemedText style={styles.statLabel}>Sessions</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol name="chart.bar.fill" size={20} color="#10B981" />
              <ThemedText style={styles.statValue}>{user.totalKwh}</ThemedText>
              <ThemedText style={styles.statLabel}>kWh Charged</ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionCard} onPress={() => router.push('/(tabs)/explore')}>
              <View style={styles.actionIcon}>
                <IconSymbol name="map.fill" size={28} color="#10B981" />
              </View>
              <ThemedText style={styles.actionTitle}>Find Charger</ThemedText>
              <ThemedText style={styles.actionSubtitle}>Search nearby</ThemedText>
            </Pressable>

            <Pressable style={styles.actionCard} onPress={() => console.log('QR Scanner coming soon')}>
              <View style={styles.actionIcon}>
                <IconSymbol name="qrcode" size={28} color="#10B981" />
              </View>
              <ThemedText style={styles.actionTitle}>Scan QR</ThemedText>
              <ThemedText style={styles.actionSubtitle}>Quick connect</ThemedText>
            </Pressable>

            <Pressable style={styles.actionCard} onPress={() => router.push('/(tabs)/charging')}>
              <View style={styles.actionIcon}>
                <IconSymbol name="clock.fill" size={28} color="#10B981" />
              </View>
              <ThemedText style={styles.actionTitle}>Reservations</ThemedText>
              <ThemedText style={styles.actionSubtitle}>View bookings</ThemedText>
            </Pressable>

            <Pressable style={styles.actionCard} onPress={() => console.log('Payment screen coming soon')}>
              <View style={styles.actionIcon}>
                <IconSymbol name="creditcard.fill" size={28} color="#10B981" />
              </View>
              <ThemedText style={styles.actionTitle}>Payment</ThemedText>
              <ThemedText style={styles.actionSubtitle}>Manage cards</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Nearby Chargers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Nearby Chargers</ThemedText>
            <Pressable>
              <ThemedText style={styles.seeAll}>See All</ThemedText>
            </Pressable>
          </View>

          {nearbyChargers.map((charger) => (
            <Pressable 
              key={charger.id} 
              style={styles.nearbyCard}
              onPress={() => router.push('/charger-details')}
            >
              <View style={styles.nearbyIcon}>
                <IconSymbol name="bolt.fill" size={24} color="#10B981" />
              </View>
              <View style={styles.nearbyInfo}>
                <ThemedText style={styles.nearbyName}>{charger.name}</ThemedText>
                <View style={styles.nearbyMeta}>
                  <IconSymbol name="location" size={14} color="#6B7280" />
                  <ThemedText style={styles.nearbyDistance}>{charger.distance}</ThemedText>
                  <View
                    style={[styles.nearbyStatusDot, { backgroundColor: '#10B981', marginLeft: 8 }]}
                  />
                  <ThemedText style={styles.nearbyStatus}>{charger.status}</ThemedText>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#6B7280" />
            </Pressable>
          ))}
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <IconSymbol name="lightbulb.fill" size={24} color="#F59E0B" />
          <View style={styles.tipsContent}>
            <ThemedText style={styles.tipsTitle}>Charging Tip</ThemedText>
            <ThemedText style={styles.tipsText}>
              Charging between 20-80% extends your battery lifespan and is faster!
            </ThemedText>
          </View>
        </View>

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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  vehicleModel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  vehicleLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  batterySection: {
    marginBottom: 20,
  },
  batteryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  batteryLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  batteryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10B981',
  },
  batteryBarContainer: {
    height: 12,
    backgroundColor: '#262626',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  batteryBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  rangeText: {
    fontSize: 13,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#262626',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#262626',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seeAll: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  nearbyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
  },
  nearbyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  nearbyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyDistance: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  nearbyStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nearbyStatus: {
    fontSize: 13,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '600',
  },
  tipsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F59E0B20',
    borderWidth: 1,
    borderColor: '#F59E0B40',
    gap: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 100,
  },
});
