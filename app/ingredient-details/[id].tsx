import IngredientForm from '../../components/IngredientForm'; // Import the IngredientForm
import { useIngredients } from '../../context/IngredientContext';
import { Ingredient, IngredientData } from '../../types/ingredient';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function IngredientDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const navigation = useNavigation(); // Get navigation object
    const { getIngredientById, updateIngredient, deleteIngredient } = useIngredients();

    const [ingredient, setIngredient] = useState<Ingredient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNavigatingAway, setIsNavigatingAway] = useState(false); // Flag for deletion navigation

    useEffect(() => {
        if (id) {
            // If we are in the process of navigating away (e.g., after delete), do nothing.
            if (isNavigatingAway) {
                setIsLoading(false); // Ensure loading state is false if we are bailing out
                return;
            }

            setIsLoading(true);
        
            const fetchedIngredient = getIngredientById(id);
            if (fetchedIngredient) {
                setIngredient(fetchedIngredient);
                navigation.setOptions({ title: fetchedIngredient.name }); // Dynamically set the title
            } else {
                // Ingredient not found. This will be caught if navigating to a non-existent ID.
                // The isNavigatingAway flag should prevent this during deletion.
                setIngredient(null); // Ensure ingredient state is cleared
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

    }, [id, getIngredientById, navigation, router, isNavigatingAway]);

    const handleFormSubmit = (data: IngredientData) => {
        if (!data.name || !data.name.trim()) {
            Alert.alert("Validation Error", "Ingredient name is required.");
            return;
        }

        if (ingredient) {
            updateIngredient({
                ...ingredient,
                name: data.name,
                category: data.category,
                location: data.location,
                confectionType: data.confectionType,
                expirationDate: data.expirationDate,
                brand: data.brand
            });
            Alert.alert("Success", "Ingredient updated successfully!");
            router.back();
        } else {
            Alert.alert("Error", "Cannot update, ingredient data is missing.");
        }
    };

    const handleDeleteIngredient = () => {
        if (ingredient) {
            Alert.alert("Confirm Delete", "Are you sure you want to delete this ingredient?", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => {
                    setIsNavigatingAway(true); // Set flag before delete and navigation
                    deleteIngredient(ingredient.id);
                    
                    Alert.alert(
                        "Success",
                        "Ingredient deleted.",
                        [{ text: "OK", onPress: () => {
                            router.push('/(tabs)/queries');
                        }}]
                        // router.push will navigate to the queries tab.
                    );
                }}
            ]);
        }
    };

    if (isLoading) {
        return <View style={styles.centered}><Text>Loading...</Text></View>;
    }

    // If navigating away (e.g., after delete confirmation but before router.push completes)
    if (isNavigatingAway) {
        return <View style={styles.centered}><Text>Processing...</Text></View>;
    }

    // If ingredient is not found (and not loading, and not navigating away)
    // This means useEffect determined it's not found, and its router.back() should have handled navigation.
    if (!ingredient) {
        return <View style={styles.centered}><Text>Ingredient not found.</Text></View>;
    }
    return (
        <KeyboardAwareScrollView>
            <View style={styles.container}>
                <IngredientForm

                    initialValues={{
                        name: ingredient.name,
                        category: ingredient.category,
                        location: ingredient.location,
                        confectionType: ingredient.confectionType,
                        expirationDate: ingredient.expirationDate,
                    }}
                    onSubmit={handleFormSubmit}
                    submitButtonTitle="Save Changes"
                />
                <View style={styles.buttonContainer}>
                    <View style={{marginTop: 10}}><Button title="Delete Ingredient" color="red" onPress={handleDeleteIngredient} /></View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    // label, input styles are now in IngredientForm
    buttonContainer: { marginTop: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
});