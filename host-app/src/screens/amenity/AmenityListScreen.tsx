import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Alert, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { RootState, AppDispatch } from '@/store';
import { fetchAmenities, removeAmenity, toggleAmenityPromotionThunk } from '@/store/slices/amenity.slice';

export default function AmenityListScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { amenities } = useSelector((state: RootState) => state.amenity);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // TODO: replace with real user name from auth/context
  const userName = 'Admin';

  useEffect(() => {
    dispatch(fetchAmenities());
  }, [dispatch]);

  const handleAddAmenity = () => {
    router.push('/add-amenity');
  };

  const handleEdit = (id: string) => {
    router.push('/edit-amenity');
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Amenity',
      'Are you sure you want to delete this amenity?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          dispatch(removeAmenity(id));
        }},
      ]
    );
  };

  const handleTogglePromotion = (id: string) => {
    dispatch(toggleAmenityPromotionThunk(id));
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
              Manage Your Amenities
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity style={styles.notifyButton} accessibilityLabel="Notifications">
          <MaterialIcons name="notifications-none" size={26} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Add New Amenity Button */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: tintColor }]} 
          onPress={handleAddAmenity}
        >
          <MaterialIcons name="add-circle-outline" size={24} color="#fff" />
          <ThemedText style={styles.addButtonText}>Add New Amenity</ThemedText>
        </TouchableOpacity>

        {/* Amenities Section */}
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            Your Amenities ({amenities.length})
          </ThemedText>

          {amenities.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: '#242424' }]}>
              <MaterialIcons name="store" size={48} color={textColor} style={{ opacity: 0.3 }} />
              <ThemedText style={[styles.emptyText, { color: textColor }]}>
                No amenities yet
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: textColor }]}>
                Add your first amenity to get started
              </ThemedText>
            </View>
          ) : (
            amenities.map((item: any) => (
              <View key={item.id} style={[styles.amenityCard, { backgroundColor: '#242424' }]}>
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <MaterialIcons name="store" size={24} color={tintColor} />
                    <View style={styles.cardHeaderText}>
                      <ThemedText style={[styles.amenityName, { color: textColor }]}>
                        {item.name}
                      </ThemedText>
                      <ThemedText style={[styles.amenityType, { color: textColor }]}>
                        {item.type}
                      </ThemedText>
                    </View>
                  </View>
                  {item.isPromoted && (
                    <View style={[styles.promotedBadge, { backgroundColor: tintColor }]}>
                      <ThemedText style={styles.promotedText}>Promoted</ThemedText>
                    </View>
                  )}
                </View>

                {/* Description */}
                <ThemedText style={[styles.description, { color: textColor }]}>
                  {item.description}
                </ThemedText>

                {/* Action Buttons */}
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { borderColor: tintColor }]} 
                    onPress={() => handleEdit(item.id)}
                  >
                    <MaterialIcons name="edit" size={16} color={tintColor} />
                    <ThemedText style={[styles.actionButtonText, { color: tintColor }]}>
                      Edit
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, { borderColor: item.isPromoted ? '#888' : tintColor }]} 
                    onPress={() => handleTogglePromotion(item.id)}
                  >
                    <MaterialIcons 
                      name={item.isPromoted ? 'star' : 'star-outline'} 
                      size={16} 
                      color={item.isPromoted ? '#888' : tintColor} 
                    />
                    <ThemedText style={[styles.actionButtonText, { color: item.isPromoted ? '#888' : tintColor }]}>
                      {item.isPromoted ? 'Unpromote' : 'Promote'}
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.actionButton, { borderColor: '#F44336' }]} 
                    onPress={() => handleDelete(item.id)}
                  >
                    <MaterialIcons name="delete-outline" size={16} color="#F44336" />
                    <ThemedText style={[styles.actionButtonText, { color: '#F44336' }]}>
                      Delete
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 8,
  },
  amenityCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  amenityName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  amenityType: {
    fontSize: 14,
    opacity: 0.7,
  },
  promotedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  promotedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  spacer: {
    height: 100,
  },
});