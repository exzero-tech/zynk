import React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { ChargerForm } from '@/components/charger/ChargerForm';
import { AppDispatch } from '@/store';
import { editCharger } from '@/store/slices/charger.slice';

export default function EditChargerScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // TODO: Get charger data from navigation params
  const chargerData = {
    name: 'Charger A',
    location: 'Downtown',
    status: 'available' as const,
  };

  const handleSubmit = async (data: { name: string; location: string; status: string }) => {
    try {
      await dispatch(editCharger({ id: '1', updates: data as { name: string; location: string; status: 'available' | 'offline' | 'maintenance' } })).unwrap();
      Alert.alert('Success', `Charger "${data.name}" updated successfully!`);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update charger');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return <ChargerForm initialData={chargerData} onSubmit={handleSubmit} onCancel={handleCancel} />;
}