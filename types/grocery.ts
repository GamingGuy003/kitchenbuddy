import { Ingredient } from "./ingredient"

export type GroceryListItem = {
    id?: string,
    item: Partial<Ingredient>
}

export type GroceryContextType = {
  items: GroceryListItem[];
  addItem: (item: GroceryListItem) => void;
  updateItem: (item: GroceryListItem) => void;
  deleteItem: (id: string) => void;
  clear: () => void;
  getItemById: (id: string) => GroceryListItem | undefined;
};
