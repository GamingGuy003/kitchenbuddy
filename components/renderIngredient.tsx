import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ingredient, stringifyAmount } from "../types/ingredient";
import { router } from "expo-router";
import dayDifference from "../constants/timeDifference";
import { FontAwesome5 } from "@expo/vector-icons";
import CommonStyles from "../constants/commonStyle";

// renders a specific ingredient for the list view
const renderIngredientItem = ({ item, hideMaturityWarning }: { item: Ingredient, hideMaturityWarning?: boolean }) => {
    return (<TouchableOpacity onPress={() => router.push(`/ingredient-details/${item.id}`)}>
        <View style={styles.ingredientView}>
            <View style={styles.info}>
                <Text style={CommonStyles.ingredientContainerTitle}>{item.name} {stringifyAmount(item.amount) || null}</Text>
                { item.brand && <Text>Brand: {item.brand}</Text> }
                { item.expirationDate && <Text>Expires: {item.expirationDate.toLocaleDateString()} </Text> }
                { item.category && <Text>Category: {item.category}</Text> }
                <Text>Added: {item.addedDate.toLocaleDateString()}</Text>
            </View>
            { item.open && <View style={styles.badge}>
                <FontAwesome5 name='box-open' color={styles.open.color}/>
                <Text style={styles.open}>Open</Text>
            </View>}
            { item.frozen && <View style={styles.badge}>
                <FontAwesome5 name='snowflake' color={styles.frozen.color}/>
                <Text style={styles.frozen}>Frozen</Text>
            </View>}
            { dayDifference(item.maturity.edited) >= 3 && !hideMaturityWarning && <View style={styles.badge}>
                <Text style={styles.ripeness}>!</Text>
                <Text style={styles.ripeness}>Check Ripeness</Text>
            </View>}
        </View>
    </TouchableOpacity>)
};

const styles = StyleSheet.create({
    ingredientView: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        gap: 5
    },
    badge: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        width: 65,
        height: 65,
    },
    ripeness: {
        ...CommonStyles.badgeText,
        color: 'darkred'
    },
    frozen: {
        ...CommonStyles.badgeText,
        color: 'cornflowerblue'
    },
    open: {
        ...CommonStyles.badgeText,
        color: '#777'
    },
    info: {
        flex: 4
    }
})

export default renderIngredientItem;