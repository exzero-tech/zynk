import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { dummyChargers } from '@/data/dummy-chargers';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();

  // TODO: replace with real user name from auth/context
  const userName = 'Alex';

  // Select first 5 chargers as favourites for demo
  const favouriteChargers = dummyChargers.slice(0, 5);

  const handleChargerPress = (charger: any) => {
    router.push({
      pathname: '/charger-details',
      params: { charger: JSON.stringify(charger) }
    });
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
              Welcome to ZYNK
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity style={styles.notifyButton} accessibilityLabel="Notifications">
          <MaterialIcons name="notifications-none" size={26} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Banner Card */}
      <View style={styles.bannerCard}>
        <Image
          source={require('../../assets/images/banner.png')}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>

      {/* Favourites Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
          Favourites
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.favouritesScroll}
        >
          {favouriteChargers.map((charger) => (
            <TouchableOpacity
              key={charger.id}
              style={[styles.favouriteCard, { backgroundColor: '#242424' }]}
              onPress={() => handleChargerPress(charger)}
            >
              <ThemedView style={styles.cardContent}>
                <ThemedText style={[styles.favouriteName, { color: textColor }]}>
                  {charger.name}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.cardFooter}>
                <ThemedView style={[styles.statusIndicator, { backgroundColor: charger.status === 'AVAILABLE' ? '#4CAF50' : charger.status === 'OCCUPIED' ? '#FF9800' : '#F44336' }]} />
                <TouchableOpacity
                  style={[styles.chargeButton, { backgroundColor: tintColor }]}
                  onPress={() => handleChargerPress(charger)}
                >
                  <MaterialIcons name="bolt" size={16} color="#fff" />
                  <ThemedText style={styles.chargeButtonText}>Charge</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Find Nearby Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
          Find Nearby
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.favouritesScroll}
        >
          {[
            { name: 'Parking', icon: 'local-parking' },
            { name: 'Restaurants', icon: 'restaurant' },
            { name: 'Restrooms', icon: 'wc' },
            { name: 'Cafes', icon: 'coffee' },
            { name: 'Supermarkets', icon: 'shopping-cart' },
            { name: 'Malls', icon: 'shopping-bag' },
            { name: 'Libraries', icon: 'book' },
          ].map((amenity) => (
            <TouchableOpacity
              key={amenity.name}
              style={[styles.nearbyCard, { backgroundColor: '#242424' }]}
              onPress={() => console.log(`Navigate to ${amenity.name}`)}
            >
              <MaterialIcons name={amenity.icon as any} size={24} color={textColor} />
              <ThemedText style={[styles.nearbyCardText, { color: textColor }]}>
                {amenity.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>
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
  bannerCard: {
    marginHorizontal: 20,
    marginTop: 2,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#242424',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerImage: {
    width: '100%',
    height: 205,
    borderRadius: 20,
    transform: [{ scale: 1.05 }],
  },
  section: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  favouritesScroll: {
    gap: 12,
    paddingRight: 20,
  },
  favouriteCard: {
    width: 140,
    height: 148,
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'space-between',
  },
  cardContent: {
    backgroundColor: 'transparent',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'transparent',
  },
  favouriteName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  favouriteAddress: {
    fontSize: 14,
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  chargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  chargeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  nearbyCard: {
    width: 100,
    height: 80,
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyCardText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});
