import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Shop } from '../types/shop';

const SHOPS_STORAGE_KEY = '@kitchen_buddy_storage';


interface ShopContextType {
  shops: Shop[];
  addShop: (shop: Partial<Shop>) => void;
  deleteShop: (id: string) => void;
  getShop: (id: string) => Shop | undefined;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [shops, setShops] = useState<Shop[]>([]); // Initialize with an empty array or your initial data

  useEffect(() => {
  // function to load Shops from storage
    const loadShops = async () => {
      try {
        const storedShops = await AsyncStorage.getItem(SHOPS_STORAGE_KEY);
        if (storedShops) {
          const parsedShops: Shop[] = JSON.parse(storedShops).map((i: any) => ({
            ...i,
            expirationDate: i.expirationDate ? new Date(i.expirationDate) : undefined,
            addedDate: new Date(i.addedDate),
            maturity: { ...i.maturity, edited: new Date(i.maturity.edited) }
          }));
          setShops(parsedShops);
        }
      } catch (error) {
        console.error("Failed to load Shops.", error);
      }
    };
    loadShops();
  }, []);

  // saves Shop to storage
  const saveShop = async (newShop: Shop[]) => {
    try {
      setShops(newShop);
      await AsyncStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(newShop));
    } catch (error) {
      console.error("Failed to save Shop.", error);
    }
  };

  // construct new shop with new id
  const addShop = (shop: Partial<Shop>) => {
    // add fallback value for possibly missing fields
    const newShop: Shop = {
      ...shop,
      name: shop.name || 'New Shop',
      type: shop.type || 'Other',
      latitude: shop.latitude || 0,
      longitude: shop.longitude || 0,
      id: Date.now().toString(),
    };
    saveShop([...shops, newShop]);
  };

  // delete shop from storage
  const deleteShop = (id: string) => {
    const newShop = shops.filter(i => i.id !== id);
    saveShop(newShop);
  };

  const getShop = (id: string) => {
    return shops.find(shop => shop.id === id)
  }


  return (
    <ShopContext.Provider value={{ shops, addShop, deleteShop, getShop }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShops = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShops must be used within a ShopProvider');
  }
  return context;
};