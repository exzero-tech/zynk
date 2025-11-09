import React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { AmenityForm } from '@/components/amenity/AmenityForm';
import { AppDispatch } from '@/store';
import { editAmenity, removeAmenity } from '@/store/slices/amenity.slice';

export default function EditAmenityScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // TODO: Get amenity data from navigation params
  const amenityData = {
    name: 'Free WiFi',
    description: 'High-speed internet access',
    type: 'Connectivity',
    isPromoted: true,
  };

  const handleSubmit = async (data: { name: string; description: string; type: string; isPromoted: boolean }) => {
    try {
      await dispatch(editAmenity({ id: '1', ...data })).unwrap(); // TODO: Get ID from navigation params
      Alert.alert('Success', `Amenity "${data.name}" updated successfully!`);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update amenity');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Amenity',
      'Are you sure you want to delete this amenity?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          dispatch(removeAmenity('1')); // TODO: Get ID from navigation params
          router.back();
        }},
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return <AmenityForm initialData={amenityData} onSubmit={handleSubmit} onCancel={handleCancel} onDelete={handleDelete} />;
}