export interface Stand {
  stand: string;
  apron: string | null;
  terminal: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SearchStandRequest {
  apron?: string;
  terminal?: string;
  stand?: string;
}
