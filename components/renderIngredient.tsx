import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ingredient } from "../types/ingredient";
import { router } from "expo-router";
import dayDifference from "../constants/timeDifference";
import { FontAwesome5 } from "@expo/vector-icons";

// renders a specific ingredient for the list view
const renderIngredientItem = ({ item }: { item: Ingredient }) => {
    return (<TouchableOpacity onPress={() => router.push(`/ingredient-details/${item.id}`)} style={styles.touchable}>
        <View style={styles.ingredientView}>
            <View style={styles.info}>
                <Text style={styles.ingredientTitle}>{item.name} {item.brand ? `(${item.brand})` : null}</Text>
                <View style={{ flexDirection: 'row' }}>
                    { item.expirationDate && <Text>Expires: {item.expirationDate.toLocaleDateString()} </Text> }
                </View>
                <Text>Category: {item.category ?? 'N/A'}</Text>
                <Text>Added: {item.addedDate.toLocaleDateString()}</Text>
            </View>
            { item.open ? 
                <View style={styles.badge}>
                    <FontAwesome5 name='box-open' color={styles.openText.color}/>
                    <Text style={styles.openText}>Open</Text>
                </View> : null }
            { item.frozen ? 
                <View style={styles.badge}>
                    <FontAwesome5 name='snowflake' color={styles.frozenText.color}/>
                    <Text style={styles.frozenText}>Frozen</Text>
                </View> : null }
            { dayDifference(item.maturity.edited) >= 3 ? 
                <View style={styles.badge}>
                    <Text style={styles.ripenessText}>!</Text>
                    <Text style={styles.ripenessText}>Check Ripeness</Text>
                </View> : null }
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
        gap: 5
    },
    ingredientTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    touchable: {
        opacity: 100
    },
    badge: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    ripenessText: {
        textAlign: 'center',
        color: 'darkred',
        fontWeight: '500'
    },
    frozenText: {
        textAlign: 'center',
        color: 'cornflowerblue',
        fontWeight: '500'
    },
    openText: {
        textAlign: 'center',
        fontWeight: '500',
        color: '#777',
    },
    info: {
        flex: 4
    }
})

export default renderIngredientItem;