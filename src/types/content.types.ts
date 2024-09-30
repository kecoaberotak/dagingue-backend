export interface ContentType {
  desc: string;
  image1: Express.Multer.File | string;
  image2: Express.Multer.File | string;
}

export interface ContentResultType {
  success: boolean;
  message: string;
  data?: { id?: string; [key: string]: any } | Array<{ id: string; [key: string]: any }>;
}
