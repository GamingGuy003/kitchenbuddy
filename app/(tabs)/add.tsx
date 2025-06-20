import IngredientForm from '../../components/IngredientForm';
import { useIngredients } from '../../context/IngredientContext';
import { Ingredient } from '../../types/ingredient';
import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGrocery } from '../../context/GroceryContext';
import { Button } from 'react-native';

export default function AddIngredientScreen() {
    const { addIngredient } = useIngredients();
    const { addItem } = useGrocery();
    
    const params = useLocalSearchParams<{ name?: string, brand?: string, category?: string }>();
    // Key to force re-render of IngredientForm after submission, effectively resetting it
    const [formKey, setFormKey] = useState(0);
    const [initialData, setInitialData] = useState<Partial<Ingredient>>({});

    useEffect(() => {
        // Pre-fill form if parameters are passed from camera scan
        const newInitialData: Partial<Ingredient> = {};
        if (params.name) newInitialData.name = params.name;
        if (params.brand) newInitialData.brand = params.brand;
        // Example for category, adjust as per your IngredientData type
        // if (params.category) newInitialData.category = params.category as any;
        
        setInitialData(newInitialData);
        // Incrementing formKey here would make the form re-initialize with new params if the screen is already mounted.
    }, [params.name, params.brand, params.category]); // Depend on specific params

    const handleAddIngredient = (data: Partial<Ingredient>) => {
        if (!data.name || !data.name.trim()) {
            Alert.alert("Validation Error", "Ingredient name is required.");
            return;
        }

        // add and save ingredient
        addIngredient(data);

        Alert.alert("Success", "Ingredient added successfully!");
        setFormKey(prevKey => prevKey + 1); // Change key to reset form
        setInitialData({}); // Clear initial data after submission so it doesn't persist for manual adds
    };

    return (
        <View style={{flex: 1}}>
            <IngredientForm
                key={formKey}
                onSubmit={handleAddIngredient}
                submitButtonTitle="Add Ingredient"
                initialValues={initialData} // Pass initial values to the form
            />
        </View>
    );
}
