import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import CommonStyles from "../../constants/commonStyle";
import { useShops } from "../../context/ShopContext";
import { ItemSeparator } from "../../components/listComponents";

export default function listShops() {
    const { shops, deleteShop } = useShops();
    return (
        <View style={CommonStyles.pageContainer}>
            <FlatList
                data={shops}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => deleteShop(item.id)}>
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