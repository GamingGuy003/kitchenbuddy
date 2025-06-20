export type ShopType = 'Supermarket' | 'Butcher' | 'Bakery' | 'Fishmonger' | 'Greengrocer' | 'Other';

export interface Shop {
    id: string;
    name: string;
    type: ShopType;
    latitude: number;
    longitude: number;
}

export const SHOP_TYPES: ShopType[] = [
    'Supermarket',
    'Butcher',
    'Bakery',
    'Fishmonger',
    'Greengrocer',
    'Supermarket',
    'Other',
];