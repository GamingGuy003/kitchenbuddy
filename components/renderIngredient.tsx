import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ingredient } from "../types/ingredient";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

type IconName = keyof typeof FontAwesome5.glyphMap;

// renders a specific ingredient
const renderIngredientItem = ({ item }: { item: Ingredient }) => {
    const opened: IconName = item.open ? 'box-open' : 'box';
    return (<TouchableOpacity onPress={() => router.push(`/ingredient-details/${item.id}`)} style={styles.touchable}>
        <View style={styles.ingredientView}>
            <Text style={styles.ingredientTitle}>{item.name}</Text>
            <View style={styles.row}>
                { item.expirationDate && <Text>Expires: {item.expirationDate.toLocaleDateString()} </Text> }
                {item.open ? <Text>(Open)</Text> : null}
            </View>
            <Text>Category: {item.category ?? 'N/A'}</Text>
            <Text>Added: {item.addedDate.toLocaleDateString()}</Text>
        </View>
    </TouchableOpacity>)
};

const styles = StyleSheet.create({
    ingredientView: {
        padding: 10,
        margin: 2,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    ingredientTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    touchable: {
        opacity: 100
    },
    row: {
        flexDirection: 'row'
    }
})

export default renderIngredientItem;