import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Button, TextInput, FlatList, ScrollView } from 'react-native';

// Define a type for Shop (can be moved to a types file later)
export interface Shop {
    id: string;
    name: string;
    type: string; // e.g., 'general', 'butcher'
    latitude: number;
    longitude: number;
}

// Sample initial shop data - this will be managed in state
const initialShops: Shop[] = [
  { id: '1', name: 'Downtown Groceries', type: 'general', latitude: 34.0522, longitude: -118.2437 },
  { id: '2', name: 'The Corner Butcher', type: 'butcher', latitude: 34.0550, longitude: -118.2450 },
];

type ViewMode = 'main' | 'seeShops' | 'addShop';

export default function GroceryListScreen() {
    
    const [viewMode, setViewMode] = useState<ViewMode>('main');
    const [shopsList, setShopsList] = useState<Shop[]>(initialShops);

    // States for Add Shop Form
    const [newShopName, setNewShopName] = useState('');
    const [newShopType, setNewShopType] = useState('');
    const [newShopLat, setNewShopLat] = useState('');
    const [newShopLon, setNewShopLon] = useState('');

    const handleAddShop = () => {
        if (!newShopName.trim() || !newShopType.trim() || !newShopLat.trim() || !newShopLon.trim()) {
            Alert.alert("Validation Error", "All shop fields are required.");
            return;
        }
        const lat = parseFloat(newShopLat);
        const lon = parseFloat(newShopLon);

        if (isNaN(lat) || isNaN(lon)) {
            Alert.alert("Validation Error", "Latitude and Longitude must be valid numbers.");
            return;
        }

        const newShop: Shop = {
            id: String(Date.now()), // Simple unique ID
            name: newShopName,
            type: newShopType,
            latitude: lat,
            longitude: lon,
        };
        setShopsList(prevShops => [...prevShops, newShop]);
        Alert.alert("Success", "Shop added successfully!");
        // Reset form and view
        setNewShopName('');
        setNewShopType('');
        setNewShopLat('');
        setNewShopLon('');
        setViewMode('main');
    };

    
    if (viewMode === 'seeShops') {
        return (
            <View style={styles.container}>
                <Text>Registered Shops</Text>
                <FlatList
                    data={shopsList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.shopItem}>
                            <Text style={styles.shopName}>{item.name} ({item.type})</Text>
                            <Text>Lat: {item.latitude.toFixed(4)}, Lon: {item.longitude.toFixed(4)}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text>No shops registered yet.</Text>}
                />
                <Button title="Back to Grocery List" onPress={() => setViewMode('main')} />
            </View>
        );
    }

    if (viewMode === 'addShop') {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text>Add New Shop</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Shop Name"
                    value={newShopName}
                    onChangeText={setNewShopName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Shop Type (e.g., general, butcher)"
                    value={newShopType}
                    onChangeText={setNewShopType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Latitude"
                    value={newShopLat}
                    onChangeText={setNewShopLat}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Longitude"
                    value={newShopLon}
                    onChangeText={setNewShopLon}
                    keyboardType="numeric"
                />
                <View style={styles.buttonContainer}>
                    <Button title="Save Shop" onPress={handleAddShop} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Cancel" onPress={() => setViewMode('main')} color="grey" />
                </View>
            </ScrollView>
        );
    }

    // Main view
    return (
        <View style={styles.container}>
            
            
            <View style={styles.topButtonsRow}>
                <View style={styles.buttonColumn}>
                    <Button title="See Shops" onPress={() => setViewMode('seeShops')} />
                </View>
                <View style={styles.buttonColumn}>
                    <Button title="Add Shop" onPress={() => setViewMode('addShop')} />
                </View>
            </View>
            {/* Your actual grocery list items will go here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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
    shopItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    shopName: {
        fontSize: 18,
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