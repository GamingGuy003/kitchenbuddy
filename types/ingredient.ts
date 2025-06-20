import { CATEGORIES, CONFECTIONS, LOCATIONS, RIPENESS } from "../constants/ingredientProperties";

export type IngredientCategory = typeof CATEGORIES[number];
export type IngredientLocation = typeof LOCATIONS[number];
export type IngredientConfection = typeof CONFECTIONS[number];
export type IngredientAmount =
  { kind: 'Count'; value: number } | // eg 6 eggs
  { kind: 'Fraction'; value: number } | // eg 50% of a carton of milk
  { kind: 'Custom'; value: number | string; unit: string }; // eg 546 ml of oil

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