export const CATEGORIES = ['Fruit', 'Vegetable', 'Dairy', 'Fish', 'Meat', 'Liquid', 'Pantry Staple', 'Spice', 'Other'];
export const LOCATIONS = ['Fridge', 'Freezer', 'Pantry', 'Counter', 'Other'];
export const CONFECTION_TYPES = ['Fresh', 'Canned', 'Frozen', 'Cured', 'Dried', 'Cooked', 'Other'];

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

export interface ExpiryThreshold {
    label: string;
    value: number;
}
export const EXPIRY_THRESHOLDS: ExpiryThreshold[] = [
    { label: 'Next 3 Days', value: 3 },
    { label: 'Next 7 Days', value: 7 },
    { label: 'Next 14 Days', value: 14 },
    { label: 'Next 30 Days', value: 30 },
    { label: 'Today', value: 0 },
    { label: 'Overdue', value: -1 },
];