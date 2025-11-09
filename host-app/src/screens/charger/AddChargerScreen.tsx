import React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { ChargerForm } from '@/components/charger/ChargerForm';
import { AppDispatch } from '@/store';
import { createCharger } from '@/store/slices/charger.slice';

export default function AddChargerScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSubmit = async (data: { name: string; location: string; status: string }) => {
    try {
      await dispatch(createCharger(data as { name: string; location: string; status: 'available' | 'offline' | 'maintenance' })).unwrap();
      Alert.alert('Success', `Charger "${data.name}" added successfully!`);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add charger');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return <ChargerForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}