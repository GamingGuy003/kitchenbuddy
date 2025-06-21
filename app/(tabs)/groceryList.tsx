import React, { useState, ReactNode } from 'react';
import { Text, View, StyleSheet, Alert, Button, TextInput, ScrollView, FlatList } from 'react-native';
import { Shop, ShopType, SHOP_TYPES } from '../../types/shop';
import { Picker } from '@react-native-picker/picker';
import { useShops } from '../../context/ShopContext'; // Import useShops
import { useGrocery } from '../../context/GroceryContext';
import RenderItemList from '../../components/renderItemList';
import { ItemSeparator } from '../../components/listComponents';
import CommonStyles from '../../constants/commonStyle';


type ViewMode = 'main' | 'seeShops' | 'addShop';

export default function GroceryListScreen(): ReactNode {   
    const [viewMode, setViewMode] = useState<ViewMode>('main');
    const { shops, addShop } = useShops(); // Use the context

    // States for Add Shop Form
    const [newShopName, setNewShopName] = useState('');
    const [newShopType, setNewShopType] = useState<ShopType | undefined>(undefined);
    const [newShopLat, setNewShopLat] = useState('');
    const [newShopLon, setNewShopLon] = useState('');

    const { items } = useGrocery();

    const handleAddShop = () => {
        if (!newShopName.trim() || newShopType === undefined || !newShopLat.trim() || !newShopLon.trim()) {
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
            type: newShopType!, // Use non-null assertion as we've checked for undefined
            latitude: lat,
            longitude: lon,
        };
        addShop(newShop);
        Alert.alert("Success", "Shop added successfully!");
        // Reset form and view
        setNewShopName('');
        setNewShopType(undefined);
        setNewShopLat('');
        setNewShopLon('');
        setViewMode('main');
    };

    
    if (viewMode === 'seeShops') {
        return (
            <View style={CommonStyles.pageContainer}>
                <Text style={styles.title}>Registered Shops</Text>
                <FlatList
                    data={shops}
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
            <ScrollView contentContainerStyle={CommonStyles.pageContainer}>
                <Text style={styles.title}>Add New Shop</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Shop Name"
                    value={newShopName}
                    onChangeText={setNewShopName}
                />
                <Text style={styles.label}>Shop Type</Text>
                <Picker
                    style={styles.picker}
                    itemStyle={styles.pickerItem}

                    selectedValue={newShopType}
                    onValueChange={(itemValue) => setNewShopType(itemValue)}
                >
                    <Picker.Item label="Select Shop Type..." value={undefined} />
                    {SHOP_TYPES.map(type => (
                        <Picker.Item key={type} label={type} value={type} />))}
                </Picker>
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
        <View style={CommonStyles.pageContainer}>
            <FlatList
                style={CommonStyles.list}
                keyExtractor={(item) => item.id}
                data={items}
                renderItem={RenderItemList}
                ItemSeparatorComponent={ItemSeparator}
            />
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