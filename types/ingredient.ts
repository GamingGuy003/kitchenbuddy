import { CATEGORIES, CONFECTIONS, LOCATIONS } from "../constants/ingredientProperties";

export type IngredientCategory = typeof CATEGORIES[number];
export type IngredientLocation = typeof LOCATIONS[number];
export type IngredientConfection = typeof CONFECTIONS[number];

export interface Ingredient {
  id: string;
  name: string;
  category?: IngredientCategory;
  location?: IngredientLocation;
  confectionType?: IngredientConfection;
  expirationDate?: Date;
  addedDate: Date;
  brand?: string;
}

export type IngredientContextType = {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'addedDate'>) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  deleteIngredient: (id: string) => void;
  getIngredientById: (id: string) => Ingredient | undefined;
};

export interface IngredientData { // For form submissions
  name: string;
  category?: IngredientCategory;
  location?: IngredientLocation;
  confectionType?: IngredientConfection;
  expirationDate?: Date;
  brand?: string;
}
