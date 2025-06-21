import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet, Button } from "react-native";
import { useGrocery } from "../../context/GroceryContext";
import { GroceryListItem } from "../../types/grocery";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IngredientForm from "../../components/IngredientForm";
import { Ingredient } from "../../types/ingredient";
import { useIngredients } from "../../context/IngredientContext";
import dayDifference from "../../constants/timeDifference";
import CommonStyles from "../../constants/commonStyle";

export default function ItemDetailScreen(): ReactNode {
    const [isNavigatingAway, setIsNavigatingAway] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [item, setItem] = useState<GroceryListItem | null>();

    const { getItemById, updateItem, deleteItem } = useGrocery();
    const { addIngredient } = useIngredients();
    const navigation = useNavigation();
    const { id } = useLocalSearchParams<{ id: string }>();
    
    useEffect(() => {
        if (id) {
            // If we are in the process of navigating away (e.g., after delete), do nothing.
            if (isNavigatingAway) {
                setIsLoading(false); // Ensure loading state is false if we are bailing out
                return;
            }
            
            setIsLoading(true);
            
            const fetchedItem = getItemById(id);
            if (fetchedItem) {
                setItem(fetchedItem);
                navigation.setOptions({ title: fetchedItem?.item.name }); // Dynamically set the title
            } else {
                // Ingredient not found. This will be caught if navigating to a non-existent ID.
                // The isNavigatingAway flag should prevent this during deletion.
                setItem(null) // Ensure ingredient state is cleared
                Alert.alert("Error", "Ingredient not found."); // Show error
                router.back();
            } 
        } else {
            Alert.alert("Error", "Ingredient ID missing.");
            router.back();
            setIsLoading(false); // Ensure loading is set to false before returning
            return; // Return early if no id
        }
        setIsLoading(false);

    }, [id, getItemById, navigation, router, isNavigatingAway]);
    
    // handles the edit of a grocery list item
    const handleEdit = (data: Partial<Ingredient>) => {
        if (!data.name || !data.name.trim()) {
            Alert.alert('Validation Error', 'Ingredient name is required.');
            return;
        }

        if (item) {
            updateItem({
                ...item,
                item: {
                    ...data
                }
            });
            Alert.alert('Success', 'Ingredient updated successfully!');
            router.back();
        } else {
            Alert.alert('Error', 'Cannot update, ingredient data is missing.');
        }
    };

    // handles deletion of a grocery list item
    const handleDeleteItem = () => {
        if (item) {
            Alert.alert('Confirm Delete', 'Are you sure you want to delete this ingredient?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {
                    setIsNavigatingAway(true); // Set flag before delete and navigation
                    deleteItem(item.id);
                    
                    // return to where we came from
                    Alert.alert(
                        'Success',
                        'Ingredient deleted.',
                        [{ text: 'OK', onPress: () => {
                            router.back();
                        }}]
                    );
                }}
            ]);
        }
    };

    // if bought, delete from grocery list and add to ingredients
    const handleBought = () => {
        if (item?.item) {
            Alert.alert('Confirm Purchase', 'Move item to Pantry?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', style: 'default', onPress: () => {
                    setIsNavigatingAway(true); // Set flag before delete and navigation
                    addIngredient(item.item);
                    deleteItem(item.id);
                    
                    // return to where we came from
                    Alert.alert(
                        'Success',
                        'Ingredient moved.',
                        [{ text: 'OK', onPress: () => {
                            router.back();
                        }}]
                    );
                }}
            ]);
        }
    }

    if (isLoading) return <View style={styles.centered}><Text>Loading...</Text></View>;

    // If navigating away (e.g., after delete confirmation but before router.push completes)
    if (isNavigatingAway) return <View style={styles.centered}><Text>Processing...</Text></View>;

    // If ingredient is not found (and not loading, and not navigating away)
    // This means useEffect determined it's not found, and its router.back() should have handled navigation.
    if (!item) return <View style={styles.centered}><Text>Ingredient not found.</Text></View>;

    const expectedExpiry = new Date();
    // calcualte the interval between item being added and its expiration date,
    // then project that interval from the current time to show how long item will most likely last from now
    item.item.expirationDate && expectedExpiry.setDate(expectedExpiry.getDate() + dayDifference(item.item.expirationDate, item.item.addedDate));

    return (
        <KeyboardAwareScrollView style={CommonStyles.pageContainer}>
            <IngredientForm
                initialValues={{
                    ...item.item,
                    expirationDate: expectedExpiry
                }}
                leftButton={{ onSubmit: handleEdit, title: 'Save' }}
                rightButton={{ onSubmit: handleBought, title: 'Bought' }}
                datePrefilled={true}
            />
            <View style={{ marginTop: 20 }}>
                <Button title='Delete Ingredient' color='red' onPress={handleDeleteItem}/>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
});