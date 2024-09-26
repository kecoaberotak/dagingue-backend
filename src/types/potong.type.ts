export interface PotongType {
  name: string;
  desc: string;
  price: number;
  image: Express.Multer.File | string;
}
export interface UploadPotongResult {
  success: boolean;
  message: string;
  data?: { id: string; [key: string]: any } | Array<{ id: string; [key: string]: any }>;
}
