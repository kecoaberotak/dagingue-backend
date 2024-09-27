export interface ProductType {
  name: string;
  desc: string;
  price: number;
  image: Express.Multer.File | string;
}
export interface ProductResultType {
  success: boolean;
  message: string;
  data?: { id?: string; [key: string]: any } | Array<{ id: string; [key: string]: any }>;
}

export interface ResponseDataType {
  status: boolean;
  statusCode: number;
  message: string;
  data?: { id?: string; [key: string]: any } | Array<{ id?: string; [key: string]: any }>;
}
