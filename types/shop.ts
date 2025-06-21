import { IngredientCategory } from "./ingredient";

export const SHOP_TYPES = ['Supermarket', 'Butcher', 'Bakery', 'Fishmonger', 'Greengrocer', 'Other'];

export type ShopType = typeof SHOP_TYPES[number];

export interface Shop {
    id: string;
    name: string;
    type: ShopType;
    categories: IngredientCategory[],
    latitude: number;
    longitude: number;
}