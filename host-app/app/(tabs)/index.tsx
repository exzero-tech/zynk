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
    activeChargers: 12,
    totalChargers: 15,
    todayEarnings: 1250.00,
    activeSessions: 5,
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
          <View style={styles.statsGrid}>
            {/* Active Chargers */}
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: '#242424' }]}
              onPress={() => router.push('/(tabs)/chargers')}
            >
              <View style={[styles.statIconContainer, { backgroundColor: tintColor + '15' }]}>
                <MaterialIcons name="ev-station" size={28} color={tintColor} />
              </View>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {stats.activeChargers}/{stats.totalChargers}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Active Chargers
              </ThemedText>
            </TouchableOpacity>

            {/* Today's Earnings */}
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: '#242424' }]}
              onPress={() => router.push('/(tabs)/earnings')}
            >
              <View style={[styles.statIconContainer, { backgroundColor: tintColor + '15' }]}>
                <MaterialIcons name="attach-money" size={28} color={tintColor} />
              </View>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                Rs. {stats.todayEarnings.toLocaleString('en-LK')}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Today&apos;s Earnings
              </ThemedText>
            </TouchableOpacity>

            {/* Active Sessions */}
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: '#242424' }]}
            >
              <View style={[styles.statIconContainer, { backgroundColor: tintColor + '15' }]}>
                <MaterialIcons name="flash-on" size={28} color={tintColor} />
              </View>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {stats.activeSessions}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Active Sessions
              </ThemedText>
            </TouchableOpacity>

            {/* Total Chargers */}
            <TouchableOpacity 
              style={[styles.statCard, { backgroundColor: '#242424' }]}
              onPress={() => router.push('/(tabs)/chargers')}
            >
              <View style={[styles.statIconContainer, { backgroundColor: tintColor + '15' }]}>
                <MaterialIcons name="analytics" size={28} color={tintColor} />
              </View>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {stats.totalChargers}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Total Chargers
              </ThemedText>
            </TouchableOpacity>
          </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: 'center',
  },
  spacer: {
    height: 100,
  },
});
