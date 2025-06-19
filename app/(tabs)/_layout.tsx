import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

export default function TabLayout() {
  return (
    <Tabs screenOptions={({ route }) => ({
        animation: 'shift',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconName = 'help-circle'; // Default icon
          // determine which icon to render
          if (route.name === 'add') iconName = focused ? 'add-circle' : 'add-circle-outline'
          else if (route.name === 'expiringSoon') iconName = focused ? 'alert-circle' : 'alert-circle-outline'
          else if (route.name === 'queries') iconName = focused ? 'search' : 'search-outline'
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#063580',
        tabBarInactiveTintColor: 'gray',
      })
    }>
      <Tabs.Screen
        name="add" // This will look for app/(tabs)/add.tsx
        options={{
          title: 'Add Ingredient',
        }}
      />
      <Tabs.Screen
        name="queries" // This will look for app/(tabs)/queries.tsx
        options={{
          title: 'Queries',
        }}
      />
      <Tabs.Screen
        name="expiringSoon" // This will look for app/(tabs)/expiringSoon.tsx
        options={{
          title: 'Expiring Soon',
        }}
      />
      <Tabs.Screen
        name="camera" // This will look for app/(tabs)/expiringSoon.tsx
        options={{
          title: 'camera',
        }}
      />
    </Tabs>
  );
}