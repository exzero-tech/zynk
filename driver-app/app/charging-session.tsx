import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DummyCharger } from '@/data/dummy-chargers';

export default function ChargingSessionScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse charger data
  const charger: DummyCharger = params.charger ? JSON.parse(params.charger as string) : null;

  // Charging session state
  const [isCharging, setIsCharging] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(25); // Starting at 25%
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [energyDelivered, setEnergyDelivered] = useState(0); // in kWh
  
  // Typical EV battery capacity: 50-100 kWh, using 60 kWh as average
  const batteryCapacity = 60; // kWh
  const currentPower = charger?.powerOutput || 50; // in kW

  // Simulate realistic charging progress
  useEffect(() => {
    if (!isCharging) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      
      // Calculate energy added this second
      // kW * (1 second / 3600 seconds per hour) = kWh added per second
      const energyPerSecond = currentPower / 3600;
      
      setEnergyDelivered(prev => {
        const newEnergy = prev + energyPerSecond;
        
        // Calculate new battery percentage
        // (current capacity + energy added) / total capacity * 100
        const currentCapacity = (batteryLevel / 100) * batteryCapacity;
        const newCapacity = currentCapacity + energyPerSecond;
        const newPercentage = (newCapacity / batteryCapacity) * 100;
        
        setBatteryLevel(currentBatt => {
          if (newPercentage >= 100) {
            setIsCharging(false);
            return 100;
          }
          return Math.min(100, newPercentage);
        });
        
        return newEnergy;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCharging, currentPower, batteryLevel, batteryCapacity]);

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate estimated time remaining
  const estimatedTimeRemaining = () => {
    const remainingPercent = 100 - batteryLevel;
    const remainingCapacity = (remainingPercent / 100) * batteryCapacity; // kWh remaining
    const hoursRemaining = remainingCapacity / currentPower;
    const secondsRemaining = hoursRemaining * 3600;
    return formatTime(Math.round(secondsRemaining));
  };

  // Calculate current cost (based on energy delivered * price per kWh)
  const calculateCost = () => {
    const cost = energyDelivered * (charger?.pricePerKwh || 100);
    return cost.toFixed(2);
  };

  const handleStopCharging = () => {
    setIsCharging(false);
    // TODO: Show confirmation dialog
  };

  const handleEndSession = () => {
    // TODO: Navigate to payment/summary screen
    router.back();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>
          {isCharging ? 'Charging' : 'Completed'}
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Charger Name */}
          <View style={[styles.chargerCard, { backgroundColor: '#242424' }]}>
            <MaterialIcons name="ev-station" size={24} color={tintColor} />
            <View style={styles.chargerInfo}>
              <ThemedText style={[styles.chargerName, { color: textColor }]}>
                {charger?.name || 'Charging Station'}
              </ThemedText>
              <ThemedText style={[styles.chargerDetails, { color: textColor }]}>
                {charger?.connectorType} • {charger?.powerOutput} kW
              </ThemedText>
            </View>
          </View>

          {/* Battery Progress Circle */}
          <View style={[styles.progressCard, { backgroundColor: '#242424' }]}>
            <View style={styles.circleContainer}>
              {/* Outer circle with gradient effect simulation */}
              <View style={[styles.progressCircle, { borderColor: tintColor }]}>
                <View style={styles.innerCircle}>
                  <ThemedText style={[styles.batteryPercentage, { color: tintColor }]}>
                    {Math.round(batteryLevel)}%
                  </ThemedText>
                  <ThemedText style={[styles.batteryLabel, { color: textColor }]}>
                    Battery
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Charging Status */}
            <View style={[styles.statusBadge, { backgroundColor: isCharging ? tintColor + '20' : '#6B728020' }]}>
              <MaterialIcons 
                name={isCharging ? 'bolt' : 'check-circle'} 
                size={16} 
                color={isCharging ? tintColor : '#6B7280'} 
              />
              <ThemedText style={[styles.statusText, { color: isCharging ? tintColor : '#6B7280' }]}>
                {isCharging ? 'Charging in Progress' : 'Charging Complete'}
              </ThemedText>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {/* Time Elapsed */}
            <View style={[styles.statCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="schedule" size={20} color={textColor} style={{ opacity: 0.5 }} />
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Time Elapsed
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {formatTime(elapsedTime)}
              </ThemedText>
            </View>

            {/* Estimated Time */}
            <View style={[styles.statCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="timer" size={20} color={textColor} style={{ opacity: 0.5 }} />
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Est. Remaining
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {isCharging ? estimatedTimeRemaining() : '--:--:--'}
              </ThemedText>
            </View>

            {/* Energy Delivered */}
            <View style={[styles.statCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="flash-on" size={20} color={textColor} style={{ opacity: 0.5 }} />
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Energy
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {energyDelivered.toFixed(2)} kWh
              </ThemedText>
            </View>

            {/* Current Power */}
            <View style={[styles.statCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="power" size={20} color={textColor} style={{ opacity: 0.5 }} />
              <ThemedText style={[styles.statLabel, { color: textColor }]}>
                Power
              </ThemedText>
              <ThemedText style={[styles.statValue, { color: textColor }]}>
                {currentPower} kW
              </ThemedText>
            </View>
          </View>

          {/* Cost Summary */}
          <View style={[styles.costCard, { backgroundColor: '#242424' }]}>
            <View style={styles.costHeader}>
              <MaterialIcons name="account-balance-wallet" size={24} color={tintColor} />
              <ThemedText style={[styles.costTitle, { color: textColor }]}>
                Current Cost
              </ThemedText>
            </View>
            <ThemedText style={[styles.costAmount, { color: tintColor }]}>
              Rs. {calculateCost()}
            </ThemedText>
            <ThemedText style={[styles.costDetails, { color: textColor }]}>
              {charger?.pricePerKwh} LKR/kWh • {energyDelivered.toFixed(2)} kWh delivered
            </ThemedText>
          </View>

          {/* Additional Info */}
          <View style={[styles.infoCard, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
            <MaterialIcons name="info" size={18} color={tintColor} />
            <ThemedText style={[styles.infoText, { color: textColor }]}>
              {isCharging 
                ? 'You can safely leave your vehicle. You will be notified when charging is complete.' 
                : 'Please disconnect your vehicle and remove the charging cable.'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Action Button */}
      <View style={[styles.fixedButtonContainer, { backgroundColor }]}>
        {isCharging ? (
          <TouchableOpacity
            style={[styles.stopButton, { backgroundColor: '#F44336' }]}
            onPress={handleStopCharging}
          >
            <MaterialIcons name="stop" size={22} color="#fff" />
            <ThemedText style={styles.buttonText}>
              Stop Charging
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.endButton, { backgroundColor: tintColor }]}
            onPress={handleEndSession}
          >
            <MaterialIcons name="check-circle" size={22} color="#fff" />
            <ThemedText style={styles.buttonText}>
              End Session
            </ThemedText>
          </TouchableOpacity>
        )}
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chargerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  chargerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  chargerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  chargerDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  circleContainer: {
    marginBottom: 20,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  batteryPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  batteryLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  costCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  costTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  costAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  costDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
    opacity: 0.8,
  },
  spacer: {
    height: 100,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  endButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
