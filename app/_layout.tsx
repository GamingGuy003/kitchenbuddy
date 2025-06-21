import React, { ReactNode } from 'react';
import { Stack } from 'expo-router';
import { IngredientProvider } from '../context/IngredientContext';
import { ShopProvider } from '../context/ShopContext';
import { useShopProximity } from '../hooks/useShopProximity';
import { GroceryProvider } from '../context/GroceryContext';

function AppLogic() {
  useShopProximity();
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
        <Stack.Screen name='shops' options={{ headerShown: false}} />
      </Stack>
    </ShopProvider>
    </GroceryProvider>
    </IngredientProvider>
  );
}