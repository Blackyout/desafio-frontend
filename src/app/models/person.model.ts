export interface Person {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface PersonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
}
