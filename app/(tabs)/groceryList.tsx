import IngredientForm from '../../components/IngredientForm';
import { useIngredients } from '../../context/IngredientContext';
import { IngredientData } from '../../types/ingredient';
import React, { useState, useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GroceryListScreen() {
    

    return (
        <View style={{flex: 1}}>
            <Text>Grocery List</Text>
        </View>
    );
}
