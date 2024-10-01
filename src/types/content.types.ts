export interface AboutType {
  desc: string;
  image1: Express.Multer.File | string;
  image2: Express.Multer.File | string;
}

export interface MediaType {
  email: string;
  phone: string;
  address: string;
  maps: string;
  instagram: string;
  whatsapp: string;
  shopee: string;
  logo_image: Express.Multer.File | string;
  hero_image: Express.Multer.File | string;
  background_image: Express.Multer.File | string;
  footer_image: Express.Multer.File | string;
}

export interface ContentResultType {
  success: boolean;
  message: string;
  data?: { id?: string; [key: string]: any } | Array<{ id: string; [key: string]: any }>;
}
