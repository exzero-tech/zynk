import { StyleSheet, View, ScrollView, Pressable, Image, Modal } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';
import { router } from 'expo-router';

export default function ChargerDetailsScreen() {
  const [selectedConnector, setSelectedConnector] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [duration, setDuration] = useState(2); // hours

  // Mock data - will be fetched from API based on route params
  const charger = {
    id: 1,
    name: 'Mall Parking Charger',
    vendor: 'ChargeMaster Pro',
    address: '456 Colombo Road, Colombo 03',
    distance: '0.5 km',
    rating: 4.5,
    reviews: 128,
    status: 'Available',
    openHours: '24/7',
    connectors: [
      { id: 1, type: 'Type 2', power: '7.2 kW', price: 150, status: 'Available' },
      { id: 2, type: 'CCS2', power: '50 kW', price: 300, status: 'Available' },
    ],
    amenities: ['WiFi', 'Cafe', 'Parking', 'Restroom', 'Waiting Area'],
    description:
      'Fast charging station located in the heart of Colombo. Perfect for quick charging while shopping or dining. Safe, well-lit parking with 24/7 security.',
    hostName: 'John Doe',
    hostRating: 4.8,
    hostVerified: true,
    images: [], // Will contain charger photos
    coordinates: { lat: 6.9271, lng: 79.8612 },
  };

  const connector = charger.connectors[selectedConnector];
  const totalPrice = connector.price * duration;

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    // TODO: Call API to create reservation
    console.log('Booking confirmed:', { chargerId: charger.id, connectorId: connector.id, duration });
    setShowBookingModal(false);
    // Navigate to charging tab to show reservation
    router.push('/(tabs)/charging');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <IconSymbol name="bolt.fill" size={64} color="#10B981" />
          </View>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.favoriteButton}>
            <IconSymbol name="heart" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Main Info */}
        <View style={styles.content}>
          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, styles.statusAvailable]}>
              <View style={styles.statusDot} />
              <ThemedText style={styles.statusText}>{charger.status}</ThemedText>
            </View>
            <ThemedText style={styles.openHours}>{charger.openHours}</ThemedText>
          </View>

          {/* Title and Rating */}
          <ThemedText style={styles.chargerName}>{charger.name}</ThemedText>
          <ThemedText style={styles.vendor}>{charger.vendor}</ThemedText>

          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color="#F59E0B" />
            <ThemedText style={styles.rating}>{charger.rating}</ThemedText>
            <ThemedText style={styles.reviews}>({charger.reviews} reviews)</ThemedText>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <View style={styles.locationRow}>
              <IconSymbol name="location.fill" size={20} color="#10B981" />
              <View style={styles.locationInfo}>
                <ThemedText style={styles.address}>{charger.address}</ThemedText>
                <ThemedText style={styles.distance}>{charger.distance} away</ThemedText>
              </View>
              <Pressable style={styles.directionsButton}>
                <IconSymbol name="arrow.triangle.turn.up.right.circle.fill" size={24} color="#10B981" />
              </Pressable>
            </View>
          </View>

          {/* Connectors */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Available Connectors</ThemedText>
            <View style={styles.connectorsContainer}>
              {charger.connectors.map((conn, index) => (
                <Pressable
                  key={conn.id}
                  style={[
                    styles.connectorCard,
                    selectedConnector === index && styles.connectorCardSelected,
                  ]}
                  onPress={() => setSelectedConnector(index)}
                >
                  <View style={styles.connectorHeader}>
                    <ThemedText style={styles.connectorType}>{conn.type}</ThemedText>
                    <View style={[styles.connectorStatus, styles.connectorStatusAvailable]}>
                      <ThemedText style={styles.connectorStatusText}>{conn.status}</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.connectorPower}>{conn.power}</ThemedText>
                  <ThemedText style={styles.connectorPrice}>{conn.price} LKR/hr</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Amenities</ThemedText>
            <View style={styles.amenitiesContainer}>
              {charger.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color="#10B981" />
                  <ThemedText style={styles.amenityText}>{amenity}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>About</ThemedText>
            <ThemedText style={styles.description}>{charger.description}</ThemedText>
          </View>

          {/* Host Info */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Host</ThemedText>
            <View style={styles.hostCard}>
              <View style={styles.hostAvatar}>
                <ThemedText style={styles.hostInitial}>{charger.hostName[0]}</ThemedText>
              </View>
              <View style={styles.hostInfo}>
                <View style={styles.hostNameRow}>
                  <ThemedText style={styles.hostName}>{charger.hostName}</ThemedText>
                  {charger.hostVerified && (
                    <IconSymbol name="checkmark.seal.fill" size={16} color="#10B981" />
                  )}
                </View>
                <View style={styles.hostRatingRow}>
                  <IconSymbol name="star.fill" size={12} color="#F59E0B" />
                  <ThemedText style={styles.hostRating}>{charger.hostRating}</ThemedText>
                  <ThemedText style={styles.hostLabel}>• Verified Host</ThemedText>
                </View>
              </View>
              <Pressable style={styles.contactButton}>
                <IconSymbol name="message.fill" size={20} color="#10B981" />
              </Pressable>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <ThemedText style={styles.priceLabel}>Price</ThemedText>
          <ThemedText style={styles.price}>{connector.price} LKR/hr</ThemedText>
        </View>
        <Pressable style={styles.bookButton} onPress={handleBookNow}>
          <ThemedText style={styles.bookButtonText}>Book Now</ThemedText>
          <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Booking Confirmation Modal */}
      <Modal visible={showBookingModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.bookingModal}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Confirm Booking</ThemedText>
              <Pressable onPress={() => setShowBookingModal(false)}>
                <IconSymbol name="xmark" size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.bookingItem}>
                <ThemedText style={styles.bookingLabel}>Charger</ThemedText>
                <ThemedText style={styles.bookingValue}>{charger.name}</ThemedText>
              </View>
              <View style={styles.bookingItem}>
                <ThemedText style={styles.bookingLabel}>Connector</ThemedText>
                <ThemedText style={styles.bookingValue}>
                  {connector.type} • {connector.power}
                </ThemedText>
              </View>
              <View style={styles.bookingItem}>
                <ThemedText style={styles.bookingLabel}>Duration</ThemedText>
                <View style={styles.durationControl}>
                  <Pressable
                    style={styles.durationButton}
                    onPress={() => setDuration(Math.max(1, duration - 0.5))}
                  >
                    <IconSymbol name="minus" size={18} color="#FFFFFF" />
                  </Pressable>
                  <ThemedText style={styles.durationValue}>{duration} hrs</ThemedText>
                  <Pressable style={styles.durationButton} onPress={() => setDuration(duration + 0.5)}>
                    <IconSymbol name="plus" size={18} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>
              <View style={styles.bookingDivider} />
              <View style={styles.bookingItem}>
                <ThemedText style={styles.bookingTotalLabel}>Total Price</ThemedText>
                <ThemedText style={styles.bookingTotalValue}>{totalPrice} LKR</ThemedText>
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setShowBookingModal(false)}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={confirmBooking}>
                <ThemedText style={styles.confirmButtonText}>Confirm Booking</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  imageContainer: {
    height: 280,
    backgroundColor: '#1A1A1A',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusAvailable: {
    backgroundColor: '#10B98120',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  openHours: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  chargerName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vendor: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
  },
  reviews: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  address: {
    fontSize: 15,
    color: '#E5E7EB',
    marginBottom: 4,
  },
  distance: {
    fontSize: 13,
    color: '#6B7280',
  },
  directionsButton: {
    padding: 8,
  },
  connectorsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  connectorCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#262626',
  },
  connectorCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#10B98110',
  },
  connectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectorType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  connectorStatus: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  connectorStatusAvailable: {
    backgroundColor: '#10B98130',
  },
  connectorStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
  },
  connectorPower: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  connectorPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
  },
  amenityText: {
    fontSize: 13,
    color: '#E5E7EB',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#9CA3AF',
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    gap: 12,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hostInfo: {
    flex: 1,
  },
  hostNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  hostRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hostRating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },
  hostLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B98120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderColor: '#262626',
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  bookingModal: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bookingDetails: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingLabel: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  bookingValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  durationControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  durationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    minWidth: 60,
    textAlign: 'center',
  },
  bookingDivider: {
    height: 1,
    backgroundColor: '#262626',
    marginVertical: 16,
  },
  bookingTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookingTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#262626',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#262626',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});