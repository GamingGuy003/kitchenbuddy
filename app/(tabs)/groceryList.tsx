import React, { useState, ReactNode, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Button, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Shop, ShopType, SHOP_TYPES } from '../../types/shop';
import { Picker } from '@react-native-picker/picker';
import { useShops } from '../../context/ShopContext'; // Import useShops
import { useGrocery } from '../../context/GroceryContext';
import RenderItemList from '../../components/renderItemList';
import { ItemSeparator } from '../../components/listComponents';
import CommonStyles from '../../constants/commonStyle';
import Slider from '@react-native-community/slider';
import { calculateDistance, getLocation } from '../../hooks/useShopProximity';
import { LocationObject } from 'expo-location';
import { IngredientCategory } from '../../types/ingredient';
import { router } from 'expo-router';



type ViewMode = 'main' | 'seeShops' | 'addShop';

export default function GroceryListScreen(): ReactNode {
    const { shops } = useShops(); // Use the context

    const { items } = useGrocery();

    const [ proximityRadiusKm, setProximityRadiusKm ] = useState<number>(0.5);
    const [location, setLocation] = useState<LocationObject | undefined>();

    useEffect(() => {
        const fetchLocation = async () => {
            const location = await getLocation();
            setLocation(location);
        }

        fetchLocation();
    }, []);
    
    // filter shops by what is in range
    const shopsWithinRange = () => {
        return location ? shops.filter(shop => calculateDistance(shop.latitude, shop.longitude, location?.coords.latitude, location?.coords.longitude) < proximityRadiusKm) : shops;
    }

    // return only items where shops exist in proximity that sell category
    const itemsWithinRange = () => {
        return items.filter(item => {
            const shops = shopsWithinRange();
            for (const shop of shops) {
                if (shop.categories.find(category => category === item.item.category)) return true;
            }
            return false;
        });
    }

    // Main view
    return (
        <View style={CommonStyles.pageContainer}>
            <Text style={CommonStyles.label}>
                Shop Proximity Radius: {proximityRadiusKm.toFixed(1)} km
            </Text>
            <Slider
                // style={}
                minimumValue={0.1} // Set a minimum value for the slider
                maximumValue={5.0} // Set a maximum value for the slider
                step={0.1} // Define the step size for the slider
                value={proximityRadiusKm} // Bind the slider's value to the hook's state
                onValueChange={setProximityRadiusKm} // Update the hook's state when the slider changes
            />

            <FlatList
                style={CommonStyles.list}
                keyExtractor={(item) => item.id}
                data={itemsWithinRange()}
                renderItem={RenderItemList}
                ItemSeparatorComponent={ItemSeparator}
            />

            <View style={styles.topButtonsRow}>
                <View style={styles.buttonColumn}>
                    <Button title="See Shops" onPress={() => router.push(`/shops/listShops`)} />
                </View>
                <View style={styles.buttonColumn}>
                    <Button title="Add Shop" onPress={() => router.push(`/shops/addShop`)} />
                </View>
            </View>
            {/* Your actual grocery list items will go here */}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        margin: 5,
        fontWeight: '500',
        width: '100%', // Ensure label takes full width
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    picker: {
        width: '100%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        width: '100%',
    },
    pickerItem: {
        // Add any specific styles for picker items if needed
        // For example, fontSize: 16,
    },
    shopItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    shopName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 10,
        width: '80%', // Or adjust as needed
        alignSelf: 'center',
    },
    topButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Distributes space around items
        width: '100%', // Take full width to allow columns to spread
        marginBottom: 20, // Add some space below the buttons
    },
    buttonColumn: {
        width: '45%', // Each button column takes up a portion of the row
        // If you want a small gap between buttons, you could add marginHorizontal here
    }
});