<<<<<<< HEAD
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
=======
import IngredientForm from '../../components/IngredientForm';
>>>>>>> b4b0a379aa1e27c5311bd72574b03bbf93db5002
import { useIngredients } from '../../context/IngredientContext';
import { IngredientData } from '../../types';
<<<<<<< HEAD

function AddIngredientScreen() {
=======
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

export default function AddIngredientScreen() {
>>>>>>> b4b0a379aa1e27c5311bd72574b03bbf93db5002
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
<<<<<<< HEAD

export default AddIngredientScreen;
=======
>>>>>>> b4b0a379aa1e27c5311bd72574b03bbf93db5002
