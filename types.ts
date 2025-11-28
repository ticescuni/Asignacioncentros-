export interface Center {
  id: string;
  code: string;
  name: string;
  zone: string;
}

export interface FilterState {
  name: string;
  zone: string;
  code: string;
}

// Declaration for the global XLSX variable loaded via CDN
declare global {
  interface Window {
    XLSX: any;
  }
}
