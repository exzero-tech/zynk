import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();

  // TODO: Replace with real user data from auth/context
  const userName = 'John Doe';
  const userEmail = 'john.doe@zynk.com';
  const userPhone = '+94 77-123-4567';

  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: 'person-outline', label: 'Personal Information', action: () => console.log('Personal Info') },
        { icon: 'ev-station', label: 'My Chargers', action: () => router.push('/(tabs)/chargers') },
        { icon: 'star-outline', label: 'My Amenities', action: () => console.log('Amenities') },
        { icon: 'payment', label: 'Payment Methods', action: () => console.log('Payment') },
      ],
    },
    {
      section: 'Preferences',
      items: [
        { icon: 'notifications-none', label: 'Notifications', action: () => console.log('Notifications') },
        { icon: 'language', label: 'Language', action: () => console.log('Language') },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: 'help-outline', label: 'Help & Support', action: () => console.log('Help') },
        { icon: 'info-outline', label: 'About', action: () => console.log('About') },
        { icon: 'privacy-tip', label: 'Privacy Policy', action: () => console.log('Privacy') },
      ],
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedText type="title" style={styles.title}>
        Profile
      </ThemedText>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: '#242424' }]}>
          <View style={[styles.avatar, { backgroundColor: tintColor + '15' }]}>
            <ThemedText style={[styles.avatarText, { color: tintColor }]}>
              {userName.split(' ').map(n => n[0]).join('')}
            </ThemedText>
          </View>
          <View style={styles.userInfo}>
            <ThemedText style={[styles.userName, { color: textColor }]}>
              {userName}
            </ThemedText>
            <ThemedText style={[styles.userEmail, { color: textColor }]}>
              {userEmail}
            </ThemedText>
            <ThemedText style={[styles.userPhone, { color: textColor }]}>
              {userPhone}
            </ThemedText>
          </View>
        </View>

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
              {section.section}
            </ThemedText>
            <View style={[styles.menuCard, { backgroundColor: '#242424' }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.menuItemLeft}>
                    <MaterialIcons name={item.icon as any} size={24} color={textColor} />
                    <ThemedText style={[styles.menuItemLabel, { color: textColor }]}>
                      {item.label}
                    </ThemedText>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={textColor} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#242424' }]}>
          <MaterialIcons name="logout" size={20} color="#F44336" />
          <ThemedText style={styles.logoutText}>
            Logout
          </ThemedText>
        </TouchableOpacity>

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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    marginTop: 20,
    marginLeft: 20,
  },
  userCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginHorizontal: 20,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  spacer: {
    height: 150,
  },
});
