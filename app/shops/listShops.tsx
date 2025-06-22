import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import CommonStyles from "../../constants/commonStyle";
import { useShops } from "../../context/ShopContext";
import { ItemSeparator } from "../../components/listComponents";

export default function listShops() {
    const { shops, deleteShop } = useShops();

    const handleDelete = (id: string) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this shop?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => {
                            deleteShop(id);
                            
                            // return to where we came from
                            Alert.alert(
                                'Success',
                                'Shop deleted',
                                [{ text: 'Ok'}]
                            );
                        }}
                    ]);
    }

    return (
        <View style={CommonStyles.pageContainer}>
            <FlatList
                data={shops}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <View style={{...CommonStyles.item, flexDirection: 'column' }}>
                            <Text style={CommonStyles.ingredientContainerTitle}>{item.name} ({item.type})</Text>
                            <Text>Lat: {item.latitude.toFixed(4)}, Lon: {item.longitude.toFixed(4)}</Text>
                            { item.categories.length > 0 && <Text>Categories: {item.categories.join(', ')}</Text> }
                        </View>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={ItemSeparator}
                ListEmptyComponent={<Text>No shops registered yet.</Text>}
            />
        </View>
    );
}