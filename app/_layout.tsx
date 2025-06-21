import React, { ReactNode } from 'react';
import { Stack } from 'expo-router';
import { IngredientProvider } from '../context/IngredientContext';
import { ShopProvider } from '../context/ShopContext';
import { GroceryProvider } from '../context/GroceryContext';

export default function RootLayout(): ReactNode {
  return (
    <IngredientProvider>
    <GroceryProvider>
    <ShopProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ShopProvider>
    </GroceryProvider>
    </IngredientProvider>
  );
}