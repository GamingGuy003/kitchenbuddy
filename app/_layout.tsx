import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { IngredientProvider } from '../context/IngredientContext';
import { ShopProvider } from '../context/ShopContext';
import { useShopProximity } from '../hooks/useShopProximity';
import { GroceryProvider } from '../context/GroceryContext';
import { AppState } from 'react-native';

function AppLogic() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  
  // refresh shopproximity if appstate changes
  useEffect(() => {
    // update appstate if app changes focus
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => subscription.remove();
  }, []);

  useShopProximity(appStateVisible);
  return null; // It doesn't render anything
}

export default function RootLayout(): ReactNode {
  return (
    <IngredientProvider>
    <GroceryProvider>
    <ShopProvider>
      <AppLogic />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ShopProvider>
    </GroceryProvider>
    </IngredientProvider>
  );
}