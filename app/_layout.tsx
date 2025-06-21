import React, { ReactNode } from 'react';
import { Stack } from 'expo-router';
import { IngredientProvider } from '../context/IngredientContext';
import { ShopProvider } from '../context/ShopContext';
import { useShopProximity } from '../hooks/useShopProximity';
import { GroceryProvider } from '../context/GroceryContext';

function AppLogic() {
  // This component will call the hook.
  // It's inside the providers so it has access to the contexts it needs.
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
      </Stack>
    </ShopProvider>
    </GroceryProvider>
    </IngredientProvider>
  );
}