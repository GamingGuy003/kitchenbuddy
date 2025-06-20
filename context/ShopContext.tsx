import React, { createContext, useState, useContext } from 'react';
import { Shop } from '../types/shop';

interface ShopContextType {
  shops: Shop[];
  setShops: React.Dispatch<React.SetStateAction<Shop[]>>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shops, setShops] = useState<Shop[]>([]); // Initialize with an empty array or your initial data
  return (
    <ShopContext.Provider value={{ shops, setShops }}>
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