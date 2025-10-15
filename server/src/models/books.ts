import { author } from './authors';
export interface book {
  title: string;
  published_year: string;
  created_at: string;
  updated_at: string;
  authors: author[];
}
