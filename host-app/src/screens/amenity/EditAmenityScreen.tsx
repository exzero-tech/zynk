import React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { AmenityForm } from '@/components/amenity/AmenityForm';
import { AppDispatch } from '@/store';
// import { editAmenity } from '@/store/slices/amenity.slice'; // TODO: Create slice

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
      // await dispatch(editAmenity({ id: '1', updates: data })).unwrap();
      console.log('Updating amenity:', data);
      Alert.alert('Success', `Amenity "${data.name}" updated successfully!`);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update amenity');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return <AmenityForm initialData={amenityData} onSubmit={handleSubmit} onCancel={handleCancel} />;
}