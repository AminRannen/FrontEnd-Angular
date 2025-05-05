// src/app/models/article.model.ts

// src/app/models/article.model.ts
export interface Article {
  id: number;
  designation: string;
  marque: string; 
  reference: string;
  qtestock: number;
  prix: string; // or number if you parse it
  quantity?: number; // <-- Add this
  imageart: string;
  scategorieID: number;
  scategorie?: {  // Optional nested object
    id: number;
    nomscategorie: string;
    imagescategorie: string;
  };
}

// Example of Scategorie model (if needed)
export interface Scategorie {
  id: number;
  name: string;
  // ... other fields
}

// Example of LigneCommande model (if needed)
export interface LigneCommande {
  id: number;
  quantity: number;
  // ... other fields
}