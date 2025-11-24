export interface Product {
  id?: string;
  name: string;
  sku: string;
  price: number;
  owner?: number;
  owner_details?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}
