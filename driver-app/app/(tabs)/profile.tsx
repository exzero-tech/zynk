import { StyleSheet, View, ScrollView, Pressable, Switch } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoReserve, setAutoReserve] = useState(false);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+94 77 123 4567',
    memberSince: 'January 2024',
    vehicleModel: 'Tesla Model 3',
    vehiclePlate: 'CAA-1234',
    totalSessions: 45,
    totalKwh: 523.4,
    carbonSaved: 89.5, // kg
  };

  const menuItems = [
    { icon: 'person.fill', label: 'Edit Profile', screen: null },
    { icon: 'car.fill', label: 'My Vehicle', screen: null },
    { icon: 'creditcard.fill', label: 'Payment Methods', screen: null },
    { icon: 'clock.fill', label: 'Charging History', screen: null },
    { icon: 'star.fill', label: 'Favorite Chargers', screen: null },
    { icon: 'bell.fill', label: 'Notifications', screen: null },
    { icon: 'gearshape.fill', label: 'Settings', screen: null },
    { icon: 'questionmark.circle.fill', label: 'Help & Support', screen: null },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>{user.name[0]}</ThemedText>
            </View>
            <Pressable style={styles.editAvatarButton}>
              <IconSymbol name="camera.fill" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
          <ThemedText style={styles.userName}>{user.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
          <ThemedText style={styles.memberSince}>Member since {user.memberSince}</ThemedText>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="bolt.fill" size={24} color="#10B981" />
            <ThemedText style={styles.statValue}>{user.totalSessions}</ThemedText>
            <ThemedText style={styles.statLabel}>Sessions</ThemedText>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="battery.100" size={24} color="#10B981" />
            <ThemedText style={styles.statValue}>{user.totalKwh}</ThemedText>
            <ThemedText style={styles.statLabel}>kWh Charged</ThemedText>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="leaf.fill" size={24} color="#10B981" />
            <ThemedText style={styles.statValue}>{user.carbonSaved}</ThemedText>
            <ThemedText style={styles.statLabel}>kg CO₂ Saved</ThemedText>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>My Vehicle</ThemedText>
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleIcon}>
              <IconSymbol name="car.fill" size={32} color="#10B981" />
            </View>
            <View style={styles.vehicleInfo}>
              <ThemedText style={styles.vehicleModel}>{user.vehicleModel}</ThemedText>
              <ThemedText style={styles.vehiclePlate}>{user.vehiclePlate}</ThemedText>
            </View>
            <Pressable style={styles.editButton}>
              <IconSymbol name="pencil" size={20} color="#10B981" />
            </Pressable>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <Pressable key={index} style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <IconSymbol name={item.icon as any} size={20} color="#10B981" />
                </View>
                <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
                <IconSymbol name="chevron.right" size={20} color="#6B7280" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
          <View style={styles.menuContainer}>
            <View style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <IconSymbol name="bell.badge.fill" size={20} color="#10B981" />
              </View>
              <ThemedText style={styles.menuLabel}>Push Notifications</ThemedText>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#262626', true: '#10B98150' }}
                thumbColor={notificationsEnabled ? '#10B981' : '#9CA3AF'}
              />
            </View>
            <View style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <IconSymbol name="clock.badge.checkmark.fill" size={20} color="#10B981" />
              </View>
              <ThemedText style={styles.menuLabel}>Auto-Reserve on Arrival</ThemedText>
              <Switch
                value={autoReserve}
                onValueChange={setAutoReserve}
                trackColor={{ false: '#262626', true: '#10B98150' }}
                thumbColor={autoReserve ? '#10B981' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Pressable style={styles.logoutButton}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#EF4444" />
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </Pressable>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#1A1A1A',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 13,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  vehicleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#E5E7EB',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#EF444420',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF444450',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  bottomSpacer: {
    height: 40,
  },
});