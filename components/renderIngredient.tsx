import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ingredient } from "../types/ingredient";
import { router } from "expo-router";

// renders a specific ingredient
const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity onPress={() => router.push(`/ingredient-details/${item.id}`)} style={styles.touchable}>
        <View style={styles.ingredientView}>
            <Text style={styles.ingredientTitle}>{item.name}</Text>
            { item.expirationDate && <Text>Expires: {item.expirationDate.toLocaleDateString()}</Text> }
            <Text>Category: {item.category ?? 'N/A'}</Text>
            <Text>Added: {item.addedDate.toLocaleDateString()}</Text>
        </View>
    </TouchableOpacity>
);

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
})

export default renderIngredientItem;