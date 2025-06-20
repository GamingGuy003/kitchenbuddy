import { Tabs, useRouter, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import * as Location from 'expo-location';
import { ShopProvider } from '../../context/ShopContext'; // Import ShopProvider
import { Ionicons } from '@expo/vector-icons';
import { Shop, ShopType, SHOP_TYPES } from '../../types/shop';
import { useShops } from '../../context/ShopContext';

type IconName = keyof typeof Ionicons.glyphMap;

const PROXIMITY_RADIUS_KM = 0.5; // adjust as needed

// Haversine formula to calculate distance between two lat/lon points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default function TabLayout() {
  const { shops } = useShops(); // Use the context to access shops

  const router = useRouter();
  const pathname = usePathname(); // Gets the current route path

  useEffect(() => {
    // let locationSubscription: Location.LocationSubscription | null = null;

    const checkLocationAndNavigate = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is needed to find nearby shops.');
        return;
      }

      try {
        // Get current location once for an initial check
        // For continuous monitoring, you might use Location.watchPositionAsync
        let currentLocation = await Location.getCurrentPositionAsync({});
        
        for (const shop of shops) {
          const distance = calculateDistance(currentLocation.coords.latitude, currentLocation.coords.longitude, shop.latitude, shop.longitude);
          if (distance <= PROXIMITY_RADIUS_KM) {
            if (pathname !== '/groceryList') { // Check if not already on the grocery list tab
              Alert.alert("Shop Nearby!", `You are near ${shop.name}. Switching to Grocery List.`);
              router.replace('/groceryList'); // Navigate to the grocery list tab
            }
            return; // Stop checking once a nearby shop is found and navigation occurs
          }
        }
      } catch (error) {
        console.error("Error getting location or navigating:", error);
        Alert.alert("Location Error", "Could not fetch location. Make sure location services are enabled.");
      }
    };

    checkLocationAndNavigate(); // Initial check

    // Optional: Set up a listener for location changes if you want more dynamic updates
    // This can be battery intensive, so use with caution and appropriate intervals.
    // (async () => {
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status === 'granted') {
    // locationSubscription = await Location.watchPositionAsync(
    //       {
    //         accuracy: Location.Accuracy.Balanced, // Adjust accuracy as needed
    //         timeInterval: 60000, // e.g., check every 60 seconds
    //         distanceInterval: 100, // e.g., or every 100 meters
    //       },
    //       (newLocation) => {
    //         // Re-run proximity check with newLocation.coords
    //         // Be careful with frequent navigation calls here
    //         console.log("New location:", newLocation.coords.latitude, newLocation.coords.longitude);
    //         // Potentially call a refined checkLocationAndNavigate logic here
    //       }
    //     );
    //   }
    // })();

    //return () => {
    //  if (locationSubscription != null) {
    //    locationSubscription.remove();
    //  }
    // };
  }, [router, pathname]); // Rerun effect if router or pathname changes (pathname helps avoid re-navigating if already there)



  return (
    
    <Tabs screenOptions={({ route }) => ({
        animation: 'shift',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconName = 'help-circle'; // Default icon
          // determine which icon to render
          if (route.name === 'add') iconName = focused ? 'add-circle' : 'add-circle-outline'
          else if (route.name === 'expiringSoon') iconName = focused ? 'alert-circle' : 'alert-circle-outline'
          else if (route.name === 'queries') iconName = focused ? 'search' : 'search-outline'
          else if (route.name === 'groceryList') iconName = focused ? 'list' : 'list-outline'
          else if (route.name === 'scan') iconName = focused ? 'barcode' : 'barcode-outline'
          
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
        name="expiringSoon" // This will look for app/(tabs)/expiringSoon.tsx
        options={{
          title: 'Expiring Soon',
        }}
      />
      <Tabs.Screen
        name="queries" // This will look for app/(tabs)/queries.tsx
        options={{
          title: 'Queries',
        }}
      />
      <Tabs.Screen
        name="groceryList" // This will look for app/(tabs)/expiringSoon.tsx
        options={{
          title: 'Grocery List',
        }}
      />
      <Tabs.Screen
        name="scan" // This will look for app/(tabs)/expiringSoon.tsx
        options={{
          title: 'Scan',
        }}
      />
    </Tabs>
    
  );
}