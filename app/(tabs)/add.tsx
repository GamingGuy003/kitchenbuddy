<<<<<<< HEAD
=======
import IngredientForm from '../../components/IngredientForm';
import { useIngredients } from '../../context/IngredientContext';
import { IngredientData } from '../../types/ingredient';
>>>>>>> faac2aab694a28ff654c32d9e3b48f2038ee2ac6
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useIngredients } from '../../context/IngredientContext';
import { IngredientData } from '../../types';

function AddIngredientScreen() {
    const { addIngredient } = useIngredients();
    // Key to force re-render of IngredientForm after submission, effectively resetting it
    const [formKey, setFormKey] = useState(0);

    const handleAddIngredient = (data: IngredientData) => {
        if (!data.name || !data.name.trim()) {
            Alert.alert("Validation Error", "Ingredient name is required.");
            return;
        }

        addIngredient({
            name: data.name,
            category: data.category,
            location: data.location,
            confectionType: data.confectionType,
            expirationDate: data.expirationDate,
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

export default AddIngredientScreen;
