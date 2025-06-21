import { CATEGORIES, CONFECTIONS, LOCATIONS, RIPENESS } from "../constants/ingredientProperties";

export type IngredientCategory = typeof CATEGORIES[number];
export type IngredientLocation = typeof LOCATIONS[number];
export type IngredientConfection = typeof CONFECTIONS[number];
export enum IngredientAmountKind {
  COUNT = 'Count',
  FRACTION = 'Fraction',
  CUSTOM = 'Custom',
}
export type IngredientAmount =
  { kind: IngredientAmountKind.COUNT; value: string } | // eg 6 eggs
  { kind: IngredientAmountKind.FRACTION; value: string } | // eg 50% of a carton of milk
  { kind: IngredientAmountKind.CUSTOM; value: string; unit?: string }; // eg 546 ml of oil or 1 carton of eggs

export function stringifyAmount(amount: IngredientAmount): string {
  switch (amount.kind) {
    case (IngredientAmountKind.COUNT): return `(${amount.value}pcs)`
    case (IngredientAmountKind.CUSTOM): return `(${amount.value}${amount.unit})`
    case IngredientAmountKind.FRACTION: return `(${amount.value}%)`
  }
}

export interface Ingredient {
  id: string;
  name?: string; // will be checked to be present upon submission
  category?: IngredientCategory;
  location?: IngredientLocation;
  confectionType?: IngredientConfection;
  expirationDate?: Date;
  addedDate: Date;
  brand?: string;
  open: boolean;
  maturity: { lvl: RIPENESS, edited: Date },
  frozen?: number,
  amount: IngredientAmount
};


export type IngredientContextType = {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Partial<Ingredient>) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  deleteIngredient: (id: string) => void;
  getIngredientById: (id: string) => Ingredient | undefined;
};

export type Maturity = { lvl: RIPENESS, edited: Date };