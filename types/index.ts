export interface Ingredient {
  id: string;
  name: string;
  category: string | undefined;
  location: string | undefined;
  confectionType: string | undefined;
  expirationDate?: Date | undefined;
  addedDate: Date;
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
  category?: string;
  location?: string;
  confectionType?: string;
  expirationDate?: Date;
}
