import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].card,
          borderRadius: 35,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused && (
                <View style={{
                  position: 'absolute',
                  width: 66,
                  height: 66,
                  borderRadius: 33,
                  backgroundColor: 'rgba(0, 188, 116, 0.05)',
                  top: -13,
                }} />
              )}
              <IconSymbol size={focused ? 28 : 24} name="house.fill" color={color} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused && (
                <View style={{
                  position: 'absolute',
                  width: 66,
                  height: 66,
                  borderRadius: 33,
                  backgroundColor: 'rgba(0, 188, 116, 0.05)',
                  top: -13,
                }} />
              )}
              <IconSymbol size={focused ? 28 : 24} name="magnifyingglass" color={color} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="charging"
        options={{
          title: 'Charging',
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused && (
                <View style={{
                  position: 'absolute',
                  width: 66,
                  height: 66,
                  borderRadius: 33,
                  backgroundColor: 'rgba(0, 188, 116, 0.05)',
                  top: -13,
                }} />
              )}
              <IconSymbol size={focused ? 28 : 24} name="bolt.fill" color={color} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <>
              {focused && (
                <View style={{
                  position: 'absolute',
                  width: 66,
                  height: 66,
                  borderRadius: 33,
                  backgroundColor: 'rgba(0, 188, 116, 0.05)',
                  top: -13,
                }} />
              )}
              <IconSymbol size={focused ? 28 : 24} name="person.fill" color={color} />
            </>
          ),
        }}
      />
    </Tabs>
  );
}
