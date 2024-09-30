export interface ResponseDataType {
  status: boolean;
  statusCode: number;
  message: string;
  data?: { id?: string; [key: string]: any } | Array<{ id?: string; [key: string]: any }>;
}
