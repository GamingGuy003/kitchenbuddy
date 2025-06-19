export const CATEGORIES = ['Fruit', 'Vegetable', 'Dairy', 'Fish', 'Meat', 'Liquid', 'Pantry Staple', 'Spice', 'Other'];
export const LOCATIONS = ['Fridge', 'Freezer', 'Pantry', 'Counter', 'Other'];
export const CONFECTIONS = ['Fresh', 'Canned', 'Frozen', 'Cured', 'Dried', 'Cooked', 'Other'];

export interface ExpiryEstimate {
    label: string;
    days: number;
}

export const EXPIRY_ESTIMATES: ExpiryEstimate[] = [
    { label: '1 Week', days: 7 },
    { label: '10 Days', days: 10 },
    { label: '2 Weeks', days: 14 },
    { label: '1 Month', days: 30 },
];

export enum RIPENESS {
    NONE = -1,
    GREEN = 0,
    RIPE = 1,
    ADVANCED = 2,
    OVERRIPE = 3
}