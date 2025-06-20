import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IngredientAmountKind } from '../types/ingredient';
import { GroceryContextType, GroceryListItem } from '../types/grocery';
import { RIPENESS } from '../constants/ingredientProperties';
import dayDifference from '../constants/timeDifference';

const GROCERY_STORAGE_KEY = '@kitchen_buddy_grocery';

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export const GroceryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<GroceryListItem[]>([]);

  useEffect(() => {
    // function to load grocery list from storage
    const loadGroceries = async () => {
      try {
        const storedItems = await AsyncStorage.getItem(GROCERY_STORAGE_KEY);
        if (storedItems) {
          const parsedItems: GroceryListItem[] = JSON.parse(storedItems);
          setItems(parsedItems);
        }
      } catch (error) {
        console.error("Failed to load ingredients.", error);
      }
    };
    loadGroceries();
  }, []);

  // saves items to storage
  const saveItems = async (newItems: GroceryListItem[]) => {
    try {
      setItems(newItems);
      await AsyncStorage.setItem(GROCERY_STORAGE_KEY, JSON.stringify(newItems));
    } catch (error) {
      console.error("Failed to save ingredients.", error);
    }
  };

  // construct new ingredient with new id and date
  const addItem = (item: GroceryListItem) => {
    // add fallback value for possibly missing fields
    const newItem: GroceryListItem = {
        item: {
            id: item.item?.id || Date.now().toString(),
            expirationDate: item.item?.expirationDate ? new Date(item.item.expirationDate) : undefined,
            addedDate: item.item?.addedDate || new Date(),
            maturity: { lvl: item.item?.maturity?.lvl || RIPENESS.NONE, edited: item.item?.maturity?.edited || new Date() },
            open: item.item?.open || false,
            amount: item.item?.amount || { kind: IngredientAmountKind.COUNT, value: '1' },
            ...item.item,
        },
        id: Date.now().toString(),
    };
    saveItems([...items, newItem]);
  };

  // updates existing item in list
  const updateItem = (updatedItem: GroceryListItem) => {
    const newItems = items.map(i => (i.id === updatedItem.id ? updatedItem : i));
    saveItems(newItems);
  };

  // delete item from list
  const deleteItem = (id: string) => {
    const newItems = items.filter(i => i.id !== id);
    saveItems(newItems);
  };

  const clear = () => {
    saveItems([]);
  }

  // get ingredient by id
  const getItemById = (id: string) => {
    return items.find(i => i.id === id);
  }

  return (
    <GroceryContext.Provider value={{ items, addItem, updateItem, deleteItem, getItemById, clear }}>
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (context === undefined) {
    throw new Error('useGrocery must be used within an GroceryContext provider');
  }
  return context;
};