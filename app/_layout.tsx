import React from 'react';
import { Stack } from 'expo-router';
import { IngredientProvider } from '../context/IngredientContext';

export default function RootLayout() {
  return (
    <IngredientProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </IngredientProvider>
  );
}