import React from 'react';
import { Stack } from 'expo-router';
import { IngredientProvider } from '../context/IngredientContext';
import { ShopProvider } from '../context/ShopContext';

export default function RootLayout() {
  return (
    <IngredientProvider>
      <ShopProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ShopProvider>
    </IngredientProvider>
  );
}