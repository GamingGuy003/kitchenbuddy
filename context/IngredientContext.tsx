import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient, IngredientContextType } from '../types/ingredient';

const INGREDIENTS_STORAGE_KEY = '@kitchen_buddy_ingredients';

const IngredientContext = createContext<IngredientContextType | undefined>(undefined);

export const IngredientProvider = ({ children }: { children: ReactNode }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    // function to load ingredients from storage
    const loadIngredients = async () => {
      try {
        const storedIngredients = await AsyncStorage.getItem(INGREDIENTS_STORAGE_KEY);
        if (storedIngredients) {
          const parsedIngredients: Ingredient[] = JSON.parse(storedIngredients).map((i: any) => ({
            ...i,
            expirationDate: i.expirationDate ? new Date(i.expirationDate) : undefined,
            addedDate: new Date(i.addedDate),
            maturity: { ...i.maturity, edited: new Date(i.maturity.edited) }
          }));
          setIngredients(parsedIngredients);
        }
      } catch (error) {
        console.error("Failed to load ingredients.", error);
      }
    };
    loadIngredients();
  }, []);

  // saves ingredients to storage
  const saveIngredients = async (newIngredients: Ingredient[]) => {
    try {
      setIngredients(newIngredients);
      await AsyncStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(newIngredients));
    } catch (error) {
      console.error("Failed to save ingredients.", error);
    }
  };

  // construct new ingredient with new id and date
  const addIngredient = (ingredient: Omit<Ingredient, 'id' | 'addedDate'>) => {
    const newIngredient: Ingredient = {
      ...ingredient,
      id: Date.now().toString(),
      addedDate: new Date(),
    };
    saveIngredients([...ingredients, newIngredient]);
  };

  // updates existing ingredient
  const updateIngredient = (updatedIngredient: Ingredient) => {
    const newIngredients = ingredients.map(i => (i.id === updatedIngredient.id ? updatedIngredient : i));
    saveIngredients(newIngredients);
  };

  // delete ingredient from storage
  const deleteIngredient = (id: string) => {
    const newIngredients = ingredients.filter(i => i.id !== id);
    saveIngredients(newIngredients);
  };

  // get ingredient by id
  const getIngredientById = (id: string) => {
    return ingredients.find(i => i.id === id);
  }

  return (
    <IngredientContext.Provider value={{ ingredients, addIngredient, updateIngredient, deleteIngredient, getIngredientById }}>
      {children}
    </IngredientContext.Provider>
  );
};

export const useIngredients = () => {
  const context = useContext(IngredientContext);
  if (context === undefined) {
    throw new Error('useIngredients must be used within an IngredientProvider');
  }
  return context;
};