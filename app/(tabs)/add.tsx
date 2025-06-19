import IngredientForm from '../../components/IngredientForm';
import { useIngredients } from '../../context/IngredientContext';
import { IngredientData } from '../../types/ingredient';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

export default function AddIngredientScreen() {
    const { addIngredient } = useIngredients();
    // Key to force re-render of IngredientForm after submission, effectively resetting it
    const [formKey, setFormKey] = useState(0);

    const handleAddIngredient = (data: IngredientData) => {
        if (!data.name || !data.name.trim()) {
            Alert.alert("Validation Error", "Ingredient name is required.");
            return;
        }

        // add and save ingredient
        addIngredient({
            name: data.name,
            category: data.category,
            location: data.location,
            confectionType: data.confectionType,
            expirationDate: data.expirationDate,
            brand: data.brand,
            open: data.open,
            maturity: data.maturity
        });

        Alert.alert("Success", "Ingredient added successfully!");
        setFormKey(prevKey => prevKey + 1); // Change key to reset form
    };

    return (
        <View style={{flex: 1}}>
            <IngredientForm key={formKey} onSubmit={handleAddIngredient} submitButtonTitle="Add Ingredient" />
        </View>
    );
}
