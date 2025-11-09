import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { dummyChargers } from '@/data/dummy-chargers';

interface MapCardProps {
  style?: any;
}

export function MapCard({ style }: MapCardProps) {
  const router = useRouter();

  const handleMarkerPress = (charger: any) => {
    router.push({
      pathname: '/charger-details',
      params: { charger: JSON.stringify(charger) }
    });
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 6.9000, // Battaramulla, Sri Lanka
          longitude: 79.9070,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        userInterfaceStyle="dark"
        mapType={Platform.OS === 'android' ? 'standard' : 'standard'}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        customMapStyle={darkMapStyle}
      >
        {dummyChargers.map((charger) => {
          const getMarkerColor = (status: string) => {
            switch (status) {
              case 'AVAILABLE': return '#10B981'; // Green
              case 'OCCUPIED': return '#F59E0B'; // Amber
              case 'OFFLINE': return '#6B7280'; // Gray
              case 'MAINTENANCE': return '#EF4444'; // Red
              default: return '#6B7280';
            }
          };

          return (
            <Marker
              key={charger.id}
              coordinate={{
                latitude: charger.latitude,
                longitude: charger.longitude,
              }}
              pinColor={getMarkerColor(charger.status)}
              title={charger.name}
              description={`${charger.chargingSpeed} • Rs.${charger.pricePerHour}/hr`}
              onPress={() => handleMarkerPress(charger)}
            />
          );
        })}
      </MapView>
    </View>
  );
}

// Ultra dark theme like Uber - pure black and minimal colors
const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#0a0a0a' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#707070' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0a0a0a' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#1f1f1f' }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#202020' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#252525' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#2f2f2f' }],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [{ color: '#333333' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#050505' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text',
    stylers: [{ visibility: 'off' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 110,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    borderRadius: 12,
  },
  map: {
    flex: 1,
    backgroundColor: '#333',
  },
});
