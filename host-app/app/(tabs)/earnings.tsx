import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function EarningsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const totalEarnings = 86594.50;
  const thisMonth = 28750.00;
  const thisWeek = 6500.00;
  const today = 1250.00;

  // TODO: Replace with real transaction data
  const recentTransactions = [
    { id: '1', date: '2025-11-09', amount: 450.00, charger: 'Main Street Charger #1', sessions: 3 },
    { id: '2', date: '2025-11-08', amount: 800.00, charger: 'Downtown Hub #2', sessions: 5 },
    { id: '3', date: '2025-11-07', amount: 620.00, charger: 'Main Street Charger #1', sessions: 4 },
    { id: '4', date: '2025-11-06', amount: 1180.00, charger: 'Highway Station #3', sessions: 7 },
    { id: '5', date: '2025-11-05', amount: 950.00, charger: 'Downtown Hub #2', sessions: 6 },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Page Title */}
      <View style={styles.header}>
        <ThemedText type="title" style={[styles.pageTitle, { color: textColor }]}>
          Earnings
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Total Earnings Card */}
        <View style={[styles.totalCard, { backgroundColor: tintColor }]}>
          <MaterialIcons name="account-balance-wallet" size={32} color="#fff" />
          <ThemedText style={styles.totalLabel}>Total Earnings</ThemedText>
          <ThemedText style={styles.totalAmount}>Rs. {totalEarnings.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</ThemedText>
        </View>

        {/* Earnings Breakdown */}
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Earnings Overview
          </ThemedText>

          <View style={styles.statsGrid}>
            {/* This Month */}
            <View style={[styles.statCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="calendar-today" size={20} color={textColor} style={{ opacity: 0.5 }} />
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                This Month
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: tintColor }]}>
                Rs. {thisMonth.toLocaleString('en-LK')}
              </ThemedText>
            </View>

            {/* This Week */}
            <View style={[styles.statCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="date-range" size={20} color={textColor} style={{ opacity: 0.5 }} />
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                This Week
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: tintColor }]}>
                Rs. {thisWeek.toLocaleString('en-LK')}
              </ThemedText>
            </View>

            {/* Today */}
            <View style={[styles.statCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="today" size={20} color={textColor} style={{ opacity: 0.5 }} />
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Today
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: tintColor }]}>
                Rs. {today.toLocaleString('en-LK')}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Recent Transactions */}
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Recent Transactions
          </ThemedText>

          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={[styles.transactionCard, { backgroundColor: '#242424' }]}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionLeft}>
                  <MaterialIcons name="ev-station" size={20} color={tintColor} />
                  <View style={styles.transactionInfo}>
                    <ThemedText style={[styles.transactionCharger, { color: textColor }]}>
                      {transaction.charger}
                    </ThemedText>
                    <ThemedText style={[styles.transactionDate, { color: textColor }]}>
                      {new Date(transaction.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <ThemedText style={[styles.transactionAmount, { color: tintColor }]}>
                    +Rs. {transaction.amount.toLocaleString('en-LK')}
                  </ThemedText>
                  <ThemedText style={[styles.transactionSessions, { color: textColor }]}>
                    {transaction.sessions} sessions
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
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
  header: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  totalCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 12,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
    lineHeight: 42,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  transactionCard: {
    padding: 16,
    borderRadius: 16,
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
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  transactionCharger: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    opacity: 0.7,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionSessions: {
    fontSize: 13,
    opacity: 0.7,
  },
  spacer: {
    height: 100,
  },
});
