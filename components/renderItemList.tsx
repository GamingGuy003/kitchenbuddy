import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GroceryListItem } from "../types/grocery";
import { useRouter } from "expo-router";
import CommonStyles from "../constants/commonStyle";
import { stringifyAmount } from "../types/ingredient";

export default function RenderItemList({item}: {item: GroceryListItem}) {
    const router = useRouter();

    return (<TouchableOpacity onPress={() => router.push(`/item-details/${item.id}`)}>
        <View style={styles.itemView}>
            <Text style={CommonStyles.ingredientContainerTitle}>{item.item.name} {item.item.amount && stringifyAmount(item.item.amount)}</Text>
        </View>
    </TouchableOpacity>);
}

const styles = StyleSheet.create({
    itemView: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        gap: 5
    }
});