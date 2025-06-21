import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import CommonStyles from "../../constants/commonStyle";
import { Picker } from "@react-native-picker/picker";
import { Shop, SHOP_TYPES, ShopType } from "../../types/shop";
import { useState } from "react";
import { useShops } from "../../context/ShopContext";
import { IngredientCategory } from "../../types/ingredient";

export default function addShop() {
    const { shops, addShop, deleteShop } = useShops();
    // States for Add Shop Form
    const [shopName, setShopName] = useState('');
    const [shopType, setShopType] = useState<ShopType | undefined>(undefined);
    const [shopLat, setShopLat] = useState('');
    const [shopLon, setShopLon] = useState('');
    const [categories, setCategories] = useState<IngredientCategory[]>([]);

    const handleAddShop = () => {
        if (!shopName.trim() || shopType === undefined || !shopLat.trim() || !shopLon.trim()) {
            Alert.alert("Validation Error", "All shop fields are required.");
            return;
        }
        const lat = parseFloat(shopLat);
        const lon = parseFloat(shopLon);

        if (isNaN(lat) || isNaN(lon)) {
            Alert.alert("Validation Error", "Latitude and Longitude must be valid numbers.");
            return;
        }

        const shop: Shop = {
            id: String(Date.now()), // Simple unique ID
            name: shopName,
            type: shopType!, // Use non-null assertion as we've checked for undefined
            categories: categories,
            latitude: lat,
            longitude: lon,
        };

        addShop(shop);
        Alert.alert("Success", "Shop added successfully!");
        // Reset form and view
        setShopName('');
        setShopType(undefined);
        setShopLat('');
        setShopLon('');
    };

    return (<ScrollView contentContainerStyle={CommonStyles.pageContainer}>
                <TextInput
                    style={CommonStyles.input}
                    placeholder="Shop Name"
                    value={shopName}
                    onChangeText={setShopName}
                />
                <Text style={CommonStyles.label}>Shop Type</Text>
                <Picker selectedValue={shopType} onValueChange={(itemValue) => setShopType(itemValue)}>
                    <Picker.Item label="Select Shop Type..." value={undefined} />
                    {SHOP_TYPES.map(type => (
                        <Picker.Item key={type} label={type} value={type} />))}
                </Picker>
                <TextInput
                    style={CommonStyles.input}
                    placeholder="Latitude"
                    value={shopLat}
                    onChangeText={setShopLat}
                    keyboardType="numeric"
                />
                <TextInput
                    style={CommonStyles.input}
                    placeholder="Longitude"
                    value={shopLon}
                    onChangeText={setShopLon}
                    keyboardType="numeric"
                />
                <View style={styles.bottomButtons}>
                    <Button title="Save Shop" onPress={handleAddShop} />
                </View>
            </ScrollView>
        );
}

const styles = StyleSheet.create({
    bottomButtons: {
        paddingTop: 20,
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#ddd'
    }
});