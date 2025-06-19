import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ingredient } from "../types/ingredient";
import { router } from "expo-router";
import dayDifference from "../constants/timeDifference";

// renders a specific ingredient for the list view
const renderIngredientItem = ({ item }: { item: Ingredient }) => {
    return (<TouchableOpacity onPress={() => router.push(`/ingredient-details/${item.id}`)} style={styles.touchable}>
        <View style={styles.ingredientView}>
            <View style={styles.info}>
                <Text style={styles.ingredientTitle}>{item.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    { item.expirationDate && <Text>Expires: {item.expirationDate.toLocaleDateString()} </Text> }
                    {item.open ? <Text>(Open)</Text> : null}
                </View>
                <Text>Category: {item.category ?? 'N/A'}</Text>
                <Text>Added: {item.addedDate.toLocaleDateString()}</Text>
            </View>
            { dayDifference(item.maturity.edited) >= 3 ? 
                <View style={styles.ripeness}>
                    <Text style={styles.ripenessText}>!</Text>
                    <Text style={styles.ripenessText}>Check Ripeness</Text>
                </View> : null
            }
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
        flexDirection: 'row',
    },
    ingredientTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    touchable: {
        opacity: 100
    },
    ripeness: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
    },
    ripenessText: {
        textAlign: 'center',
        color: 'darkred',
        fontWeight: '500'
    },
    info: {
        flex: 8
    }
})

export default renderIngredientItem;