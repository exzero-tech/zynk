import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();

  // TODO: replace with real user name from auth/context
  const userName = 'Admin';

  // TODO: Replace with real data from backend
  const stats = {
    activeChargers: 1,
    totalChargers: 2,
    todayEarnings: 1250.00,
    activeSessions: 2,
  };

  // TODO: Replace with real reservations from backend
  const pendingReservations = [
    {
      id: '1',
      userName: 'Kasun Perera',
      chargerName: 'Station A - Port 1',
      requestedTime: '2:30 PM - 4:00 PM',
      vehicleType: 'Tesla Model 3',
      estimatedDuration: '1.5 hrs',
    },
    {
      id: '2',
      userName: 'Nimal Silva',
      chargerName: 'Station B - Port 2',
      requestedTime: '3:00 PM - 5:00 PM',
      vehicleType: 'Nissan Leaf',
      estimatedDuration: '2 hrs',
    },
    {
      id: '3',
      userName: 'Amara Fernando',
      chargerName: 'Station A - Port 3',
      requestedTime: '4:15 PM - 6:00 PM',
      vehicleType: 'BMW i3',
      estimatedDuration: '1.75 hrs',
    },
  ];

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
              Welcome to ZYNK Host!
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity style={styles.notifyButton} accessibilityLabel="Notifications">
          <MaterialIcons name="notifications-none" size={26} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <ThemedView style={styles.section}>
          {/* Primary Stats - Full Width */}
          <TouchableOpacity 
            style={[styles.primaryCard, { backgroundColor: '#242424' }]}
            onPress={() => router.push('/(tabs)/earnings')}
            activeOpacity={0.8}
          >
            <View style={styles.primaryCardContent}>
              <View style={styles.primaryCardLeft}>
                <ThemedText style={[styles.primaryCardLabel, { color: textColor }]}>
                  Today&apos;s Earnings
                </ThemedText>
                <ThemedText style={[styles.primaryCardValue, { color: textColor }]}>
                  Rs. {stats.todayEarnings.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                </ThemedText>
                <View style={styles.primaryCardBadge}>
                  <MaterialIcons name="trending-up" size={14} color={tintColor} />
                  <ThemedText style={[styles.primaryCardBadgeText, { color: tintColor }]}>+12% from yesterday</ThemedText>
                </View>
              </View>
              <View style={[styles.primaryCardIcon, { backgroundColor: tintColor + '20' }]}>
                <MaterialIcons name="account-balance-wallet" size={36} color={tintColor} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Secondary Stats - 2 Column Grid */}
          <View style={styles.statsGrid}>
            {/* Active Chargers */}
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: '#242424' }]}
              onPress={() => router.push('/(tabs)/chargers')}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {stats.activeChargers}<ThemedText style={styles.statValueSub}>/{stats.totalChargers}</ThemedText>
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Active Chargers
              </ThemedText>
            </TouchableOpacity>

            {/* Active Sessions */}
            <View style={[styles.statCard, { backgroundColor: '#242424' }]}>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {stats.activeSessions}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Active Sessions
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Pending Reservations */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              Pending Reservations
            </ThemedText>
            {pendingReservations.length > 0 && (
              <View style={[styles.badge, { backgroundColor: tintColor }]}>
                <ThemedText style={styles.badgeText}>{pendingReservations.length}</ThemedText>
              </View>
            )}
          </View>

          {pendingReservations.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="event-available" size={48} color={textColor} style={{ opacity: 0.3 }} />
              <ThemedText style={[styles.emptyStateText, { color: textColor }]}>
                No pending reservations
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
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  badge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  emptyState: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 12,
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
  primaryCard: {
    backgroundColor: '#242424',
    borderRadius: 24,
    padding: 28,
    paddingVertical: 32,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryCardLeft: {
    flex: 1,
  },
  primaryCardLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
    fontWeight: '500',
  },
  primaryCardValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  primaryCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 188, 116, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  primaryCardBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  primaryCardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 18,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  statValueSub: {
    fontSize: 20,
    opacity: 0.5,
    fontWeight: '600',
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '500',
  },
  spacer: {
    height: 100,
  },
});
