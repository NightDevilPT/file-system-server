export interface MetaData {
  totalCount?: number; // Total number of records
  totalPages?: number; // Total pages available
  nextPage?: number | null; // Next page number (or null if last page)
  previousPage?: number | null; // Previous page number (or null if first page)
  [key: string]: any; // Allow additional metadata properties
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  statusCode: number;
  data: T;
  message: string;
  meta?: MetaData;
  error?: any; // Add this field for error responses
}
