export interface ExceptionResponseProtocol {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
  requestId?: string;
  details?: any;
}
