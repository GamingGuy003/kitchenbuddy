export const SHOP_TYPES = ['Supermarket', 'Butcher', 'Bakery', 'Fishmonger', 'Greengrocer', 'Other'];

export type ShopType = typeof SHOP_TYPES[number];

export interface Shop {
    id: string;
    name: string;
    type: ShopType;
    latitude: number;
    longitude: number;
}