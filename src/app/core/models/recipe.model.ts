export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
    notes?: string;
  }[];
  instructions: string[];
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface RecipeFormData {
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: {
    name: string;
    amount: number;
    unit: string;
    notes?: string;
  }[];
  instructions: string[];
  tags: string[];
} 