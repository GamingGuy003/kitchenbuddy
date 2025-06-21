import { Stack } from 'expo-router';

export default function ShopsLayout() {
  return (
    <Stack>
      <Stack.Screen name="addShop" options={{ title: 'Add Shop' }} />
      <Stack.Screen name="listShops" options={{ title: 'Shop List' }} />
    </Stack>
  );
}