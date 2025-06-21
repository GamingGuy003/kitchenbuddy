import IngredientForm from '../../components/IngredientForm';
import { useIngredients } from '../../context/IngredientContext';
import { Ingredient } from '../../types/ingredient';
import React, { useState, useEffect, ReactNode } from 'react';
import { Alert, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGrocery } from '../../context/GroceryContext';

export default function AddIngredientScreen(): ReactNode {
    const { addIngredient } = useIngredients();
    const { addItem } = useGrocery();
    
    const params = useLocalSearchParams<{ name?: string, brand?: string, category?: string }>();
    // Key to force re-render of IngredientForm after submission, effectively resetting it
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
            Alert.alert('Validation error', 'Ingredient name is required');
            return;
        }

        // add and save ingredient
        addIngredient(data);

        Alert.alert('Success', 'Ingredient added successfully!');
        setInitialData({}); // Clear initial data after submission so it doesn't persist for manual adds
    };

    const handleAddItem = (data: Partial<Ingredient>) => {
        if (!data.name || !data.name.trim()) {
            Alert.alert('Validation error', 'Ingredient name is required');
            return;
        }

        addItem({item: data});
        Alert.alert('Success', 'Ingredient added successfully!');
        setInitialData({});
    }

    return (
        <View style={{flex: 1}}>
            <IngredientForm
                leftButton={{ onSubmit: handleAddIngredient, title: 'Add to Pantry' }}
                rightButton={{ onSubmit: handleAddItem, title: 'Add to Grocery list'}}
                initialValues={initialData} // Pass initial values to the form
            />
        </View>
    );
}
