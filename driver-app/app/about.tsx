import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          About
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={[styles.logo, { backgroundColor: tintColor }]}>
            <MaterialIcons name="bolt" size={48} color="#fff" />
          </View>
          <ThemedText style={[styles.appName, { color: textColor }]}>
            ZYNK
          </ThemedText>
          <ThemedText style={[styles.version, { color: textColor }]}>
            Version 1.0.0
          </ThemedText>
        </View>

        {/* About Content */}
        <View style={[styles.card, { backgroundColor: '#242424' }]}>
          <ThemedText style={[styles.cardTitle, { color: textColor }]}>
            Our Mission
          </ThemedText>
          <ThemedText style={[styles.cardText, { color: textColor }]}>
            ZYNK is dedicated to making electric vehicle charging simple, accessible, and reliable. We connect EV drivers with charging stations across the country, providing real-time availability, seamless payment, and 24/7 support.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: '#242424' }]}>
          <ThemedText style={[styles.cardTitle, { color: textColor }]}>
            What We Offer
          </ThemedText>
          <View style={styles.featureItem}>
            <MaterialIcons name="map" size={20} color={tintColor} />
            <ThemedText style={[styles.featureText, { color: textColor }]}>
              Real-time charger availability and locations
            </ThemedText>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="payment" size={20} color={tintColor} />
            <ThemedText style={[styles.featureText, { color: textColor }]}>
              Secure and convenient payment options
            </ThemedText>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="filter-alt" size={20} color={tintColor} />
            <ThemedText style={[styles.featureText, { color: textColor }]}>
              Advanced filters for charger speed and amenities
            </ThemedText>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="support-agent" size={20} color={tintColor} />
            <ThemedText style={[styles.featureText, { color: textColor }]}>
              24/7 customer support
            </ThemedText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: '#242424' }]}>
          <ThemedText style={[styles.cardTitle, { color: textColor }]}>
            Contact Information
          </ThemedText>
          <ThemedText style={[styles.cardText, { color: textColor }]}>
            Email: info@zynk.app{'\n'}
            Website: www.zynk.app{'\n'}
            Support: support@zynk.app
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: '#242424' }]}>
          <ThemedText style={[styles.cardTitle, { color: textColor }]}>
            Legal
          </ThemedText>
          <ThemedText style={[styles.cardText, { color: textColor }]}>
            © 2025 ZYNK. All rights reserved.{'\n\n'}
            ZYNK is a registered trademark of ZYNK Technologies Inc.
          </ThemedText>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    opacity: 0.6,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
    opacity: 0.8,
  },
  spacer: {
    height: 40,
  },
});
