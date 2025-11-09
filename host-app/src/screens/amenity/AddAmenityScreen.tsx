import React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { AmenityForm } from '@/components/amenity/AmenityForm';
import { AppDispatch } from '@/store';
import { createAmenity } from '@/store/slices/amenity.slice';

export default function AddAmenityScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSubmit = async (data: { name: string; description: string; type: string; isPromoted: boolean }) => {
    try {
      await dispatch(createAmenity(data)).unwrap();
      Alert.alert('Success', `Amenity "${data.name}" added successfully!`);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add amenity');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return <AmenityForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}