import { useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';
import * as Location from 'expo-location';
import { useShops } from '../context/ShopContext';
import { usePathname, useRouter } from 'expo-router';

const PROXIMITY_RADIUS_KM = 0.5; // adjust as needed

// Haversine formula to calculate distance between two lat/lon points
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export function useShopProximity() {
    const { shops } = useShops();
    const router = useRouter();
    const pathname = usePathname();

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    
    const checkLocationAndNavigate = async () => {
        // early return if app isnt in foreground
        if (appStateVisible !== 'active') return;

        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location permission is needed to find nearby shops.');
            return;
        }
        
        try {
            // request last known position for speed. if no position gets returned, we ask the os to fetch an accurate new one which might take longer
            const currentLocation = await Location.getLastKnownPositionAsync({}) || await Location.getCurrentPositionAsync({});

            for (const shop of shops) {
                const distance = calculateDistance(currentLocation.coords.latitude, currentLocation.coords.longitude, shop.latitude, shop.longitude);
                if (distance <= PROXIMITY_RADIUS_KM) {
                    if (pathname !== '/groceryList') {
                        Alert.alert("Shop Nearby!", `You are near ${shop.name}. Switching to Grocery List.`);
                        router.replace('/groceryList');
                    }
                    return; // Stop checking once a nearby shop is found
                }
            }
        } catch (error) {
            console.error("Error getting location or navigating:", error);
            Alert.alert("Location Error", "Could not fetch location. Make sure location services are enabled.");
        }
    };

    // refresh shopproximity if appstate changes
    useEffect(() => {
        // update appstate if app changes focus
        const subscription = AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            checkLocationAndNavigate();
        });

        checkLocationAndNavigate();
        return () => subscription.remove();
    }, []);
}