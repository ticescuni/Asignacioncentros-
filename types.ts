export interface Center {
  id: string;
  code: string;
  name: string;
  zone: string;
  status: string;
  students: number;
}

export interface FilterState {
  name: string;
  zone: string;
  code: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof Center;
  direction: SortDirection;
}

// Declaration for the global XLSX variable loaded via CDN
declare global {
  interface Window {
    XLSX: any;
  }
}