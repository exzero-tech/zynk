import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export type ChargingCardType = 'active' | 'reservation' | 'history';

export interface ChargingCardData {
  id: string;
  chargerName: string;
  vendor?: string;
  location: string;
  status: 'active' | 'completed' | 'reserved';
  kwhCharged?: string;
  fee: string;
  startTime?: string;
  duration?: string;
  connectorType?: string;
  reservationTime?: string;
}

interface ChargingCardProps {
  data: ChargingCardData;
  type: ChargingCardType;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active':
      return styles.active;
    case 'completed':
      return styles.completed;
    case 'reserved':
      return styles.reserved;
    default:
      return styles.completed;
  }
};

export function ChargingCard({ data, type }: ChargingCardProps) {
  const renderActiveCard = () => (
    <View style={styles.card}>
      {/* Header with charger name and status */}
      <View style={styles.cardHeader}>
        <View style={styles.chargerInfo}>
          <ThemedText style={styles.chargerName}>{data.chargerName}</ThemedText>
          {data.vendor && <ThemedText style={styles.vendor}>{data.vendor}</ThemedText>}
        </View>
        <View style={[styles.statusBadge, getStatusStyle(data.status)]}>
          <ThemedText style={styles.statusText}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </ThemedText>
        </View>
      </View>

      {/* Location */}
      <ThemedText style={styles.location}>{data.location}</ThemedText>

      {/* Separator line */}
      <View style={styles.separator} />

      {/* Charging details for active sessions */}
      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <ThemedText style={styles.detailLabel}>kWh Charged</ThemedText>
          <ThemedText style={styles.detailValue}>{data.kwhCharged || '0.00'}</ThemedText>
        </View>
        <View style={styles.detail}>
          <ThemedText style={styles.detailLabel}>Fee</ThemedText>
          <ThemedText style={styles.detailValue}>{data.fee}</ThemedText>
        </View>
        <View style={styles.detail}>
          <ThemedText style={styles.detailLabel}>Duration</ThemedText>
          <ThemedText style={styles.detailValue}>{data.duration || '0 min'}</ThemedText>
        </View>
      </View>
    </View>
  );

  const renderReservationCard = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.chargerInfo}>
          <ThemedText style={styles.chargerName}>{data.chargerName}</ThemedText>
          {data.vendor && <ThemedText style={styles.vendor}>{data.vendor}</ThemedText>}
        </View>
        <View style={[styles.statusBadge, getStatusStyle(data.status)]}>
          <ThemedText style={styles.statusText}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.location}>{data.location}</ThemedText>

      {/* Separator line */}
      <View style={styles.separator} />

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <ThemedText style={styles.detailLabel}>Reserved for</ThemedText>
          <ThemedText style={styles.detailValue}>{data.reservationTime || data.startTime}</ThemedText>
        </View>
        <View style={styles.detail}>
          <ThemedText style={styles.detailLabel}>Duration</ThemedText>
          <ThemedText style={styles.detailValue}>{data.duration}</ThemedText>
        </View>
        <View style={styles.detail}>
          <ThemedText style={styles.detailLabel}>Est. Cost</ThemedText>
          <ThemedText style={styles.detailValue}>{data.fee}</ThemedText>
        </View>
      </View>
    </View>
  );

  const renderHistoryCard = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.chargerInfo}>
          <ThemedText style={styles.chargerName}>{data.chargerName}</ThemedText>
          {data.vendor && <ThemedText style={styles.vendor}>{data.vendor}</ThemedText>}
        </View>
        <View style={[styles.statusBadge, getStatusStyle(data.status)]}>
          <ThemedText style={styles.statusText}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.location}>{data.location}</ThemedText>

      {/* Separator line */}
      <View style={styles.separator} />

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <ThemedText style={styles.detailLabel}>Charged</ThemedText>
          <ThemedText style={styles.detailValue}>{data.kwhCharged || '0.00 kWh'}</ThemedText>
        </View>
        <View style={styles.detail}>
          <ThemedText style={styles.detailLabel}>Duration</ThemedText>
          <ThemedText style={styles.detailValue}>{data.duration}</ThemedText>
        </View>
        <View style={styles.detail}>
          <ThemedText style={styles.detailLabel}>Total Cost</ThemedText>
          <ThemedText style={styles.detailValue}>{data.fee}</ThemedText>
        </View>
      </View>

      <View style={styles.historyFooter}>
        <ThemedText style={styles.historyTime}>{data.startTime}</ThemedText>
      </View>
    </View>
  );

  switch (type) {
    case 'active':
      return renderActiveCard();
    case 'reservation':
      return renderReservationCard();
    case 'history':
      return renderHistoryCard();
    default:
      return renderActiveCard();
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#242424',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chargerInfo: {
    flex: 1,
    marginRight: 12,
  },
  chargerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  vendor: {
    fontSize: 14,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  active: {
    backgroundColor: '#00BC74',
  },
  completed: {
    backgroundColor: '#666666',
  },
  reserved: {
    backgroundColor: '#FFA500',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  location: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detail: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  connectorRow: {
    alignItems: 'flex-end',
  },
  connectorType: {
    fontSize: 12,
    opacity: 0.7,
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTime: {
    fontSize: 12,
    opacity: 0.6,
  },
});