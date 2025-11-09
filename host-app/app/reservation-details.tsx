import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ReservationDetailsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // TODO: Fetch reservation details from backend using id
  const reservation = {
    id: id as string,
    userName: 'Kasun Perera',
    userPhone: '+94 77 123 4567',
    chargerName: 'Station A - Port 1',
    requestedTime: '2:30 PM - 4:00 PM',
    vehicleType: 'Tesla Model 3',
    vehiclePlate: 'CAR-1234',
    estimatedDuration: '1.5 hrs',
    estimatedCost: 'Rs. 450.00',
    requestedDate: 'Today, Nov 9',
  };

  const handleAccept = () => {
    // TODO: Implement accept logic with backend
    console.log('Accept reservation:', id);
    router.back();
  };

  const handleDecline = () => {
    // TODO: Implement decline logic with backend
    console.log('Decline reservation:', id);
    router.back();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText style={[styles.headerTitle, { color: textColor }]}>
          Reservation Details
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={[styles.card, { backgroundColor: '#242424' }]}>
          <View style={styles.userSection}>
            <View style={[styles.avatar, { backgroundColor: tintColor + '20' }]}>
              <ThemedText style={[styles.avatarText, { color: tintColor }]}>
                {reservation.userName[0]}
              </ThemedText>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={[styles.userName, { color: textColor }]}>
                {reservation.userName}
              </ThemedText>
              <ThemedText style={[styles.userPhone, { color: textColor }]}>
                {reservation.userPhone}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Reservation Details Card */}
        <View style={[styles.card, { backgroundColor: '#242424' }]}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Reservation Information
          </ThemedText>

          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="event" size={20} color={tintColor} />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                  Date
                </ThemedText>
                <ThemedText style={[styles.detailValue, { color: textColor }]}>
                  {reservation.requestedDate}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="schedule" size={20} color={tintColor} />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                  Time Slot
                </ThemedText>
                <ThemedText style={[styles.detailValue, { color: textColor }]}>
                  {reservation.requestedTime}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="timer" size={20} color={tintColor} />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                  Duration
                </ThemedText>
                <ThemedText style={[styles.detailValue, { color: textColor }]}>
                  {reservation.estimatedDuration}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="ev-station" size={20} color={tintColor} />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                  Charger
                </ThemedText>
                <ThemedText style={[styles.detailValue, { color: textColor }]}>
                  {reservation.chargerName}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Vehicle Details Card */}
        <View style={[styles.card, { backgroundColor: '#242424' }]}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Vehicle Information
          </ThemedText>

          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="directions-car" size={20} color={tintColor} />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                  Vehicle Type
                </ThemedText>
                <ThemedText style={[styles.detailValue, { color: textColor }]}>
                  {reservation.vehicleType}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="confirmation-number" size={20} color={tintColor} />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={[styles.detailLabel, { color: textColor }]}>
                  License Plate
                </ThemedText>
                <ThemedText style={[styles.detailValue, { color: textColor }]}>
                  {reservation.vehiclePlate}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Cost Estimate Card */}
        <View style={[styles.card, styles.costCard, { backgroundColor: tintColor + '15' }]}>
          <View style={styles.costRow}>
            <ThemedText style={[styles.costLabel, { color: textColor }]}>
              Estimated Cost
            </ThemedText>
            <ThemedText style={[styles.costValue, { color: tintColor }]}>
              {reservation.estimatedCost}
            </ThemedText>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.declineButton]}
          onPress={handleDecline}
          activeOpacity={0.8}
        >
          <MaterialIcons name="close" size={24} color="#FF3B30" />
          <ThemedText style={styles.declineButtonText}>Decline</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton, { backgroundColor: tintColor }]}
          onPress={handleAccept}
          activeOpacity={0.8}
        >
          <MaterialIcons name="check" size={24} color="#fff" />
          <ThemedText style={styles.acceptButtonText}>Accept</ThemedText>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 32,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 16,
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 15,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 188, 116, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  costCard: {
    borderWidth: 1,
    borderColor: 'rgba(0, 188, 116, 0.3)',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  costLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  costValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  spacer: {
    height: 120,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  declineButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
  },
  acceptButton: {
    shadowColor: '#00BC74',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
